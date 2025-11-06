const Crop = require("../modals/Crop");
const User = require("../modals/User");

// ✅ Start auction (farmer/admin enables auction mode)
exports.startAuction = async (req, res) => {
  try {
    const { id } = req.params; // crop id
    const crop = await Crop.findById(id);

    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // Only farmer who owns the crop or admin can start auction
    if (crop.farmer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    crop.auctionMode = true;
    crop.highestBid = crop.price; // starting bid = base price
    crop.highestBidder = null;
    await crop.save();

    res.json({ message: "Auction started", crop });
  } catch (err) {
    res.status(500).json({ message: "Error starting auction", error: err.message });
  }
};
// Make sure req.io is set in your socket middleware when you initialize Socket.IO

// Place bid
exports.placeBid = async (req, res) => {
    try {
      const { id } = req.params; // crop id
      const { bidAmount } = req.body;
  
      const crop = await Crop.findById(id);
  
      if (!crop) return res.status(404).json({ message: "Crop not found" });
      if (!crop.auctionMode) return res.status(400).json({ message: "Auction not active" });
      if (bidAmount <= crop.highestBid)
        return res.status(400).json({ message: "Bid must be higher than current highest bid" });
  
      crop.highestBid = bidAmount;
      crop.highestBidder = req.user.id;
      await crop.save();
  
      // Notify all users in this auction room
      req.io?.to(id).emit("newBid", {
        cropId: id,
        userName: req.user.name,
        userId: req.user.id,
        amount: bidAmount,
      });
  
      res.json({ message: "Bid placed successfully", crop });
    } catch (err) {
      res.status(500).json({ message: "Error placing bid", error: err.message });
    }
  };
  
  // End auction
  exports.endAuction = async (req, res) => {
    try {
      const { id } = req.params;
      const crop = await Crop.findById(id);
  
      if (!crop) return res.status(404).json({ message: "Crop not found" });
      if (!crop.auctionMode) return res.status(400).json({ message: "Auction not active" });
  
      if (crop.farmer.toString() !== req.user.id && req.user.role !== "admin")
        return res.status(403).json({ message: "Not authorized" });
  
      crop.auctionMode = false;
      crop.status = crop.highestBidder ? "sold" : "available";
      crop.soldTo = crop.highestBidder || null;
      crop.soldPrice = crop.highestBidder ? crop.highestBid : null;
  
      await crop.save();
  
      // Notify all users in this auction room
      req.io?.to(id).emit("auctionEnded", {
        cropId: id,
        winner: crop.highestBidder,
        finalPrice: crop.soldPrice,
      });
  
      res.json({ message: "Auction ended", crop });
    } catch (err) {
      res.status(500).json({ message: "Error ending auction", error: err.message });
    }
  };
  