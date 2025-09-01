// Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("❌ No token found. Please login as admin.");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const setStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // reload list
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-gray-500 p-6">⏳ Loading orders...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!orders.length)
    return <p className="text-gray-500 p-6">No orders yet.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📦 All Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-3 hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-800">
                Order #{order._id.slice(-6)} — ₹{order.total.toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">
                {order.paymentMethod} ({order.paymentStatus})
              </p>
              <p className="text-xs text-gray-400">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                order.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "Processing"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "Shipped"
                  ? "bg-purple-100 text-purple-800"
                  : order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Shipping Info */}
          <div className="text-sm text-gray-900">
            <p>
              <strong>Name:</strong> {order.shippingAddress?.name}
            </p>
            <p>
              <strong>Phone:</strong> {order.shippingAddress?.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.shippingAddress?.address},{" "}
              {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
              {order.shippingAddress?.pincode}
            </p>
          </div>

          {/* Items */}
          {/* Items */}
          <div className="mt-2">
            <h3 className="font-semibold text-gray-700">🛍 Items:</h3>
            <ul className="divide-y">
              {order.items.map((i) => (
                <li key={i._id} className="py-2 flex items-center gap-3">
                  {i.image && (
                    <img
                      src={i.image}
                      alt={i.name}
                      className="w-16 h-15 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-xs text-gray-500">ID: {i.productId || 'N/A'}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {i.qty} × ₹{i.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Status Update Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (s) => (
                <button
                  key={s}
                  className={`px-3 py-1 rounded text-sm border ${
                    order.status === s
                      ? "bg-brand-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatus(order._id, s)}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
