const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    enum: ["kg", "quintal", "ton"], 
    required: true 
  },
  price: { type: Number, required: true }, // starting price
  auctionMode: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ["available", "sold", "pending", "expired"], 
    default: "available" 
  },
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  soldPrice: { type: Number },
  location: {
    district: { type: String },
    state: { type: String },
  },
  images: [{ type: String }],
}, { timestamps: true });

// Indexes for faster queries
cropSchema.index({ farmer: 1 });
cropSchema.index({ category: 1 });
cropSchema.index({ status: 1 });

module.exports = mongoose.model("Crop", cropSchema);
