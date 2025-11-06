const Razorpay = require("razorpay");
const OrderModel = require("../modals/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create Payment Order
const createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await OrderModel.findById(orderId).populate("buyer");

  if(!order) return res.status(404).json({ message: "Order not found" });

  const paymentOrder = await razorpay.orders.create({
    amount: order.bidAmount * 100, // in paise
    currency: "INR",
    receipt: orderId,
    payment_capture: 1
  });

  res.status(200).json({ paymentOrder });
};

// Verify Payment
const verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  // Verification logic with HMAC SHA256 (omitted for brevity)
  const order = await OrderModel.findById(orderId);
  order.paymentStatus = "completed";
  order.status = "completed";
  await order.save();
  res.status(200).json({ message: "Payment successful", order });
};

module.exports = { createPaymentOrder, verifyPayment };
