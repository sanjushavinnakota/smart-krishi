const Crop = require("../modals/Crop");
const Order = require("../modals/Order");
const User = require("../modals/User");

const finalizeAuctions = async (io, activeAuctions) => {
  setInterval(async () => {
    const now = Date.now();
    for(const cropId in activeAuctions) {
      const auction = activeAuctions[cropId];
      if(auction.endTime <= now) {
        // finalize auction
        const crop = await Crop.findById(cropId);
        if(!crop || crop.status !== "available") {
          delete activeAuctions[cropId];
          continue;
        }
       

        // Create order if there was a bid
        if (auction.highestBidder) {
          const order = await Order.create({
            crop: crop._id,
            buyer: auction.highestBidder,
            farmer: crop.farmer,
            bidAmount: auction.highestBid,
            paymentStatus: "pending",
          });
        
          crop.status = "sold";
          await crop.save();
        
          io.to(cropId).emit("auctionEnded", {
            message: "Auction ended!",
            winner: auction.userName,   // send name, not id
            bidAmount: auction.highestBid,
            orderId: order._id
          });
        }
        
        delete activeAuctions[cropId]; // Remove auction from active list
      }
    }
  }, 5000); // Check every 5 seconds
};

module.exports = finalizeAuctions;
