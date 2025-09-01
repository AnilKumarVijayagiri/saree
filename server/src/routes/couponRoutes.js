import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, adminOnly } from '../middleware/auth.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({ active: true, $or:[{expiresAt: null},{expiresAt: {$gt: now}}] }).sort({ createdAt: -1 });
  res.json(coupons);
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const c = await Coupon.create(req.body);
  res.status(201).json(c);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}));

export default router;
