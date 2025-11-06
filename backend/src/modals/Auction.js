const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    highestBidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    highestBid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
