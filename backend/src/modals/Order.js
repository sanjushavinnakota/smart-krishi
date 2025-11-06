const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bidAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending","completed","failed"], default: "pending" },
  status: { type: String, enum: ["processing","completed","cancelled"], default: "processing" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
