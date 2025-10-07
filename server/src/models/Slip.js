import mongoose from "mongoose";

const slipSchema = new mongoose.Schema({
  deliveryDate: { type: String, required: true },
  deliveryMonth: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  branch: { type: String, required: true },
  deliveryType: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  customerName: { type: String, required: true },
  cakeType: { type: String, required: true },
  customerNumber: { type: String, required: true },
  billNumber: { type: String, required: false },
  hamper: { type: String, required: false },
  topper: { type: String, required: false },
  status: { type: String, default: "pending" },
});

export default mongoose.model("Slip", slipSchema);
