// controllers/cropController.js
const Crop = require("../modals/Crop");
const Order = require("../modals/Order");
const User = require("../modals/User");

const path = require("path");

// Create Crop
const createCrop = async (req, res) => {
  try {
    const { name, category, quantity, unit, price, auctionMode, location } = req.body;

    // Store public-accessible URLs
    const images =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/uploads/crops/${path.basename(file.path)}`)
        : [];

    const crop = await Crop.create({
      farmer: req.user._id,
      name,
      category,
      quantity,
      unit,
      price,
      auctionMode,
      location,
      images,
    });

    res.status(201).json({ success: true, crop });
  } catch (err) {
    console.error("Error creating crop:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createCrop };



// Get Farmer's Crops
const getMyCrops = async (req, res) => {
  const crops = await Crop.find({ farmer: req.user._id });
  res.status(200).json({ crops });
};

// Update Crop
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    if (!crop.farmer.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    // Update text fields if present
    const fields = ["name", "category", "price", "quantity", "unit", "auctionMode", "location"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) crop[field] = req.body[field];
    });

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/crops/${path.basename(file.path)}`);
      crop.images = crop.images.concat(newImages); // append new images
    }

    await crop.save();
    res.status(200).json({ crop });
  } catch (err) {
    console.error("Error updating crop:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete Crop
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.status(200).json({ message: "Crop deleted" });
  } catch (err) {
    console.error("Error deleting crop:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Available Crops (for buyers)
const getAllCrops = async (req, res) => {
  const crops = await Crop.find({ status: "available" }).populate("farmer", "name email phone location");
  res.status(200).json({ crops });
};

// Finalize Auction
// controllers/cropController.js
const finalizeAuction = async (req, res) => {
  try {
    const { bidderId, amount } = req.body;
    const { id: cropId } = req.params;

    if (!bidderId || !amount) {
      return res.status(400).json({ message: "Bidder and amount are required" });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    if (!crop.auctionMode) return res.status(400).json({ message: "Auction not active" });
    if (crop.status !== "available") return res.status(400).json({ message: "Crop already sold" });

    const order = await Order.create({
      crop: crop._id,
      buyer: bidderId,
      farmer: crop.farmer,
      bidAmount: amount,
      paymentStatus: "pending",
    });

    crop.status = "sold";
    crop.auctionMode = false;
    crop.soldTo = bidderId;
    crop.soldPrice = amount;
    await crop.save();

    // ✅ Emit auction ended with IDs
    req.io?.to(cropId).emit("auctionEnded", {
      winner: crop.highestBidderName || "Buyer", // fallback name
      winnerId: bidderId,
      farmerId: crop.farmer.toString(),
      amount,
      orderId: order._id,
    });

    res.status(200).json({ message: "Auction finalized", order });
  } catch (err) {
    console.error("Error finalizing auction:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createCrop,
  getMyCrops,
  updateCrop,
  deleteCrop,
  getAllCrops,
  finalizeAuction
};
