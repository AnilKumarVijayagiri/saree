import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // ✅ import Product model

// Create new order (user)
const createOrder = asyncHandler(async (req, res) => {
  const { items, total, city, paymentMethod, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Populate each item with name, image, price
  const detailedItems = await Promise.all(
    items.map(async (i) => {
      const product = await Product.findById(i.product);
      if (!product) throw new Error("Product not found");
      return {
        product: product._id,
        productId: product.productId,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        qty: i.qty,
      };
    })
  );

  const order = await Order.create({
    items: detailedItems,  // ✅ save detailed items
    total,
    city,
    paymentMethod,
    shippingAddress,
    user: req.user?._id || null,
  });

  res.status(201).json(order);
});

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "productId name") // Add product details including productId
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Failed to get orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

// Update order status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status || order.status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// Get user's orders
const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json({
      orders: orders.map(order => ({
        _id: order._id,
        totalAmount: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.qty,
          price: item.price,
          image: item.image
        }))
      }))
    });
  } catch (error) {
    console.error("Failed to get user orders:", error);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
});

export { createOrder, getAllOrders, updateOrderStatus, getUserOrders };
