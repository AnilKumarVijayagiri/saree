import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, adminOnly } from '../middleware/auth.js';
import Category from '../models/Collection.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const cols = await Category.find().sort({ createdAt: -1 });
  res.json(cols);
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const c = await Category.create(req.body);
  res.status(201).json(c);
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const u = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(u);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}));

export default router;
