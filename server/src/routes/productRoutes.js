import express from "express";
import asyncHandler from "express-async-handler";
import { protect, adminOnly } from "../middleware/auth.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, category, min, max } = req.query;
    const filter = {};
    if (q) filter.name = new RegExp(q, "i");
    if (category) filter.category = category;
    if (min || max) {
      filter.price = {
        ...(min ? { $gte: Number(min) } : {}),
        ...(max ? { $lte: Number(max) } : {}),
      };
    }
    const products = await Product.find(filter)
      .populate("categoryRef")
      .sort({ createdAt: -1 });
    res.json(products);
  })
);

// GET product by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log('Fetching product with ID:', req.params.id);
    try {
      const p = await Product.findById(req.params.id).populate("categoryRef");
      if (!p) {
        console.log('Product not found');
        return res.status(404).json({ message: "Product not found" });
      }
      console.log('Product found:', p);
      res.json(p);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: "Error fetching product", error: error.message });
    }
  })
);

// CREATE product (admin only)
// Generate unique product ID
const generateProductId = async () => {
  while (true) {
    const productId = 'PRD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    // Check if this ID already exists
    const exists = await Product.findOne({ productId });
    if (!exists) return productId;
  }
};

router.post(
  "/",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (!data.categoryRef) delete data.categoryRef;
    
    // Generate and set the product ID
    data.productId = await generateProductId();
    
    const p = await Product.create(data);
    res.status(201).json(p);
  })
);


router.put(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(p);
  })
);

// DELETE product (admin only)
router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  })
);

export default router;
