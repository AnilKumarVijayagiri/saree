import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, adminOnly } from '../middleware/auth.js';
import GalleryImage from '../models/GalleryImage.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const imgs = await GalleryImage.find().sort({ createdAt: -1 });
  res.json(imgs);
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const img = await GalleryImage.create(req.body);
  res.status(201).json(img);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}));

export default router;
