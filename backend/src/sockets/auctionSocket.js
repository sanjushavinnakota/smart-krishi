const Crop = require("../modals/Crop");
const User = require("../modals/User"); 
const activeAuctions = {}; // { cropId: { highestBid, highestBidder, endTime } }

const auctionSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join auction room
    socket.on("joinAuction", ({ cropId }) => {
      socket.join(cropId);
      if (activeAuctions[cropId]) {
       // When sending current bid to new joiners
socket.emit("currentBid", {
  cropId, // 👈 add this
  userName: activeAuctions[cropId].userName,
  email: activeAuctions[cropId].email,
  highestBid: activeAuctions[cropId].highestBid,
});

      }
    });
    
    socket.on("placeBid", async ({ cropId, userId, amount, userName }) => {
      const crop = await Crop.findById(cropId);
      if (!crop || crop.status !== "available") {
        return socket.emit("bidRejected", { reason: "Crop not available" });
      }
    
      const highest = activeAuctions[cropId]?.highestBid || crop.price;
      if (amount <= highest) {
        return socket.emit("bidRejected", { reasonKey: "bidTooLow" });
      }
    
      // Initialize auction if not already
      if (!activeAuctions[cropId]) {
        activeAuctions[cropId] = {
          highestBid: crop.price,
          highestBidder: null,
          userName: null,
          email: null,
          endTime: Date.now() + 300000,
        };
      }
      // 🔹 Fetch user details
      const user = await User.findById(userId).select("name email");    
    
      // Save new highest bid
      activeAuctions[cropId].highestBid = amount;
      activeAuctions[cropId].highestBidder = userId;
      activeAuctions[cropId].userName = userName;
      activeAuctions[cropId].email = user.email;
    
      io.to(cropId).emit("newBid", { cropId, amount, userId, userName,email: user.email  });
    });
    
    
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = auctionSocket;
