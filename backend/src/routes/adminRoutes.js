// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

const User = require("../modals/User");
const Crop = require("../modals/Crop");
const Order = require("../modals/Order");

// Get all users
router.get("/users", protect, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Toggle user active/inactive
router.patch("/users/:id/toggle", protect, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isActive = !user.isActive;
  await user.save();
  res.json(user);
});

// Get all crops
router.get("/crops", protect, isAdmin, async (req, res) => {
  const crops = await Crop.find().populate("farmer", "name email");
  res.json(crops);
});

// Delete crop
router.delete("/crops/:id", protect, isAdmin, async (req, res) => {
  await Crop.findByIdAndDelete(req.params.id);
  res.json({ message: "Crop removed" });
});

// Get all orders
router.get("/orders", protect, isAdmin, async (req, res) => {
  const orders = await Order.find().populate("farmer buyer crop");
  res.json(orders);
});
// Update order status
router.patch("/orders/:id/status", protect, isAdmin, async (req, res) => {
  const { status } = req.body; // "confirmed" | "shipped" | "completed" | "cancelled"
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  await order.save();

  res.json({ message: `Order ${status}`, order });
});


module.exports = router;
