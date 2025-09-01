import express from 'express';
import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';

const router = express.Router();

const rzp = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test'
});

// Create Razorpay order (INR paise)
router.post('/razorpay/order', asyncHandler(async (req, res) => {
  const { orderId } = req.body; // local DB order id
  const ord = await Order.findById(orderId);
  if (!ord) return res.status(404).json({ message: 'Order not found' });
  const amountPaise = Math.round((ord.total || 0) * 100);
  const r = await rzp().orders.create({ amount: amountPaise, currency: 'INR', receipt: `ord_${orderId}` });
  ord.razorpayOrderId = r.id;
  await ord.save();
  res.json({ key: process.env.RAZORPAY_KEY_ID, rzpOrder: r });
}));

// Mark paid (normally via webhook or client verification)
router.post('/razorpay/confirm', asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const ord = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' }, { new: true });
  res.json(ord);
}));

export default router;
