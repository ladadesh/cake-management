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
    const { deliveryDate, deliveryTime, branch, deliveryType } = req.body;

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
    console.log("slips", slips);

    res.json(slips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch slips." });
  }
});

export default router;
