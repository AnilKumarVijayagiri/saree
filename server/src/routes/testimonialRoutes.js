import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, adminOnly } from '../middleware/auth.js';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const list = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
  res.json(list);
}));

router.post('/', asyncHandler(async (req, res) => {
  const t = await Testimonial.create(req.body); // {orderId, name, message, rating}
  res.status(201).json(t);
}));

router.get('/admin', protect, adminOnly, asyncHandler(async (req, res) => {
  const list = await Testimonial.find().sort({ createdAt: -1 });
  res.json(list);
}));

router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const t = await Testimonial.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(t);
}));

export default router;
