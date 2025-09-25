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

//DELETE slips older than 15 days
router.delete("/old", async (req, res) => {
  try {
    const days = parseInt(req.params.days, 10) || 15;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    // find slips to delete and their Cloudinary public_ids (if any)
    const slipsToDelete = await Slip.find(
      { createdAt: { $lt: cutoff } },
      "public_id"
    );

    // remove images from Cloudinary where public_id exists
    await Promise.all(
      slipsToDelete.map(async (s) => {
        if (s.public_id) {
          try {
            await cloudinary.uploader.destroy(s.public_id, {
              resource_type: "image",
            });
          } catch (err) {
            console.error(
              `Failed to remove Cloudinary image ${s.public_id}:`,
              err
            );
            // continue deleting DB records even if Cloudinary removal fails
          }
        }
      })
    );

    // delete DB records
    const result = await Slip.deleteMany({ createdAt: { $lt: cutoff } });

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
