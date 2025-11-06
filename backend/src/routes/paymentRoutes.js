const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { createPaymentOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create", protect, authorizeRoles("buyer"), createPaymentOrder);
router.post("/verify", protect, authorizeRoles("buyer"), verifyPayment);

module.exports = router;
