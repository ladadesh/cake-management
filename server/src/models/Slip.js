import mongoose from "mongoose";

const slipSchema = new mongoose.Schema({
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  branch: { type: String, required: true },
  deliveryType: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Slip", slipSchema);
