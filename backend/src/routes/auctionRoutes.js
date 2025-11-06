const express = require("express");
const router = express.Router();
const { startAuction, placeBid, endAuction } = require("../controllers/auctionController");
const { protect } = require("../middlewares/authMiddleware"); // authentication middleware

// ✅ Start auction (farmer or admin)
router.patch("/:id/start", protect, startAuction);

// ✅ Place bid (buyer)
router.post("/:id/bid", protect, placeBid);

// ✅ End auction (farmer or admin)
router.patch("/:id/end", protect, endAuction);

module.exports = router;
