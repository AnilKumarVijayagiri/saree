import express from "express";
import { createOrder, getAllOrders, updateOrderStatus, getUserOrders } from "../Controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder); // user can create order
router.get("/", protect, adminOnly, getAllOrders); // admin only
router.get("/my-orders", protect, getUserOrders); // user orders
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
