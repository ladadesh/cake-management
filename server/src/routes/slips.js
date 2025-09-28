import express from "express";
import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import Slip from "../models/Slip.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//Post upload slip
router.post("/", upload.single("slip"), async (req, res) => {
  try {
    const {
      deliveryDate,
      deliveryTime,
      branch,
      deliveryType,
      cakeType,
      customerName,
      billNumber,
      customerNumber,
      hamper,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    //compress with sharp
    const compressedImg = await sharp(req.file.buffer)
      .resize({ width: 1024 })
      .webp({ quality: 80 })
      .toBuffer();

    //upload to cloudinary
    const uploadedSlipImg = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cake_slips",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(compressedImg);
    });

    //save in mongoDB
    const slip = new Slip({
      deliveryDate,
      deliveryTime,
      branch,
      deliveryType,
      cakeType,
      customerName,
      billNumber,
      customerNumber,
      hamper,
      imageUrl: uploadedSlipImg.secure_url,
    });

    await slip.save();
    res.json({ success: true, message: "Slip uploaded successfully.🍰" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Slip Upload failed.😞" });
  }
});

//GET /slips to get all slips
router.get("/", async (req, res) => {
  try {
    // Use Mongoose's sort instead of Array.toSorted (toSorted may not exist in Node runtime)
    const slips = await Slip.find().sort({ createdAt: -1 });

    res.json(slips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch slips." });
  }
});

//DELETE slips older than 5 days
router.delete("/old", async (req, res) => {
  try {
    const days = 5; // Slips with a delivery date 5 or more days ago will be deleted.
    const cutoff = new Date();
    // Set to the beginning of today to include all of today in the "not old" range.
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - days);
    console.log("Cutoff date:", cutoff);

    // Find slips to delete using an aggregation pipeline to convert deliveryDate string to a Date object
    const slipsToDelete = await Slip.aggregate([
      {
        $addFields: {
          deliveryDateObj: {
            $dateFromString: {
              dateString: "$deliveryDate",
              format: "%d-%m-%Y",
              onError: null, // Return null on parsing error
            },
          },
        },
      },
      { $match: { deliveryDateObj: { $lt: cutoff } } },
      { $project: { public_id: 1 } }, // Only need the public_id for Cloudinary deletion
      {
        $match: { deliveryDateObj: { $ne: null, $lt: cutoff } },
      }, // Filter out nulls and match dates older than cutoff
      { $project: { public_id: 1 } }, // Only need the public_id for Cloudinary deletion and _id for DB deletion
    ]);
    console.log("Slips to delete:", slipsToDelete);

    const idsToDelete = slipsToDelete.map((s) => s._id);

    // If no slips to delete, exit early.
    if (idsToDelete.length === 0) {
      return res.json({
        success: true,
        message: "No old slips to delete.",
        deletedCount: 0,
      });
    }

    // Remove images from Cloudinary where public_id exists
    const cloudinaryPublicIds = slipsToDelete
      .map((s) => s.public_id)
      .filter(Boolean);

    await Promise.all(
      cloudinaryPublicIds.map(async (publicId) => {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        } catch (err) {
          console.error(`Failed to remove Cloudinary image ${publicId}:`, err);
          // Continue deleting DB records even if Cloudinary removal fails
        }
      })
    );

    // delete DB records
    const result = await Slip.deleteMany({ _id: { $in: idsToDelete } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} slips older than ${days} days.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting old slips:", error);
    res.status(500).json({ error: "Failed to delete old slips." });
  }
});

export default router;
