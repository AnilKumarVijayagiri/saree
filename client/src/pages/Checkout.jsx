import { useCart } from "../store/useCart";
import { useAuth } from "../store/useAuth";
import { api } from "../lib/api";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import OrderSuccess from "../components/OrderSuccess";

export default function Checkout() {
  const { user } = useAuth();
  const cart = useCart();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      nav('/auth/login', { state: { returnUrl: location.pathname } });
      return;
    }
    // Redirect to cart if it's empty
    if (cart.items.length === 0) {
      nav('/cart');
    }
  }, [user, cart.items.length, nav, location]);

  const items = cart.items;
  const [addr, setAddr] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "",
  });

  // Update address when user data is loaded
  useEffect(() => {
    if (user) {
      setAddr(prev => ({
        ...prev,
        name: user.name || prev.name
      }));
    }
  }, [user]);
  const [coupon, setCoupon] = useState({
    code: params.get("coupon") || "",
    discountPct: 0,
  });
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'

  // Validate address
  const validateAddress = () => {
    if (!addr.name) return 'Name is required';
    if (!addr.phone) return 'Phone number is required';
    if (!addr.address) return 'Address is required';
    if (!addr.city) return 'City is required';
    if (!addr.state) return 'State is required';
    if (!addr.pincode) return 'Pincode is required';
    if (!/^\d{6}$/.test(addr.pincode)) return 'Invalid pincode';
    if (!/^\d{10}$/.test(addr.phone)) return 'Invalid phone number';
    return null;
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate address
      const addressError = validateAddress();
      if (addressError) {
        setError(addressError);
        return;
      }

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.qty,
          price: item.product.price * (1 - (item.product.discount || 0) / 100)
        })),
        shippingAddress: addr,
        paymentMethod,
        total: cart.total(),
        ...(coupon.code && { coupon: coupon.code })
      };

      // Submit order
      const { data } = await api.post('/api/orders', orderData);

      if (paymentMethod === 'online') {
        // Handle online payment
        const { data: paymentData } = await api.post('/api/payment/create', {
          orderId: data.orderId,
          amount: data.total
        });

        // Load Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: paymentData.amount,
          currency: "INR",
          name: "Shaivyah",
          description: "Purchase Payment",
          order_id: paymentData.id,
          handler: async (response) => {
            // Verify payment
            await api.post('/api/payment/verify', {
              orderId: data.orderId,
              ...response
            });
            setOrderSuccess(data.orderId);
            cart.clear(); // Clear cart after successful payment
          },
          prefill: {
            name: addr.name,
            contact: addr.phone,
          },
          theme: {
            color: "#f97316"
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // For COD, show success immediately
        setOrderSuccess(data.orderId);
        cart.clear(); // Clear cart after successful order
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        await cart.load();
      } catch (err) {
        setError('Failed to load cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);
  useEffect(() => {
    setOnlineOnly(addr.city.trim().toLowerCase() !== "hyderabad");
  }, [addr.city]);

  const totalBefore = items.reduce(
  (sum, { productId, quantity }) =>
    sum + productId.price * (1 - (productId.discount || 0) / 100) * quantity,
  0
);


  const total = Math.round(totalBefore * (1 - (coupon.discountPct || 0) / 100));

  const placeOrder = async (paymentMethod) => {
    if (!user) {
      nav('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price * (1 - (item.productId.discount || 0) / 100)
        })),
        shippingAddress: addr,
        paymentMethod,
        couponCode: coupon.code || undefined,
        total: total
      };

      const { data } = await api.post('/api/orders', orderData);
      setOrderSuccess(data);
      cart.clear(); // Clear cart after successful order
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const applyCoupon = async () => {
    const { data } = await api.get("/api/coupons");
    const found = data.find(
      (c) => c.code.toLowerCase() === coupon.code.toLowerCase()
    );
    if (found) setCoupon({ code: found.code, discountPct: found.discountPct });
    else alert("Invalid coupon");
  };
  console.log("Cart items before order:", cart.items);


const createOrder = async (paymentMethod) => {
  const order = {
    items: items.map((i) => ({
      product: i.productId._id || i.productId,
      qty: i.quantity || i.qty,
      price: i.productId.price || 0,
      image: i.productId.images?.[0] || '',
      name: i.productId.name || '',
    })),
    total,
    city: addr.city,
    paymentMethod,
    shippingAddress: addr,
  };

  const token = localStorage.getItem("token"); // ✅ get token

  if (!token) {
    alert("You must be logged in to place an order.");
    return;
  }

  const { data } = await api.post("/api/orders", order, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ attach token
    },
  });

  return data;
};



  const handleCOD = async () => {
    try {
      const ord = await createOrder("COD");
      await cart.clear();
      setOrderSuccess({ orderId: ord._id, total });
    } catch (error) {
      console.error('Error placing COD order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleOnline = async () => {
    try {
      const ord = await createOrder("Online");
      const { data } = await api.post("/api/payment/razorpay/order", {
        orderId: ord._id,
      });
      const options = {
        key: data.key,
        amount: data.rzpOrder.amount,
        currency: "INR",
        name: "Shaivyah",
        description: "Order Payment",
        order_id: data.rzpOrder.id,
        handler: async function () {
          await api.post("/api/payment/razorpay/confirm", { orderId: ord._id });
          await cart.clear();
          setOrderSuccess({ orderId: ord._id, total });
        },
        prefill: { name: addr.name, contact: addr.phone },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error processing online payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  if (orderSuccess) {
    return <OrderSuccess orderId={orderSuccess.orderId} total={orderSuccess.total} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            🚚 Shipping Address
          </h2>

          <div className="space-y-4">
            {["name", "phone", "address", "city", "state", "pincode"].map(
              (k) => (
                <input
                  key={k}
                  placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                  value={addr[k]}
                  onChange={(e) => setAddr({ ...addr, [k]: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              )
            )}
          </div>

          {/* Coupon Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-700">Apply Coupon</h3>
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <input
                value={coupon.code}
                onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter coupon code"
              />
              <button
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-medium 
                           hover:bg-indigo-700 transition shadow-sm w-full sm:w-auto"
                onClick={applyCoupon}
              >
                Apply
              </button>
            </div>
            {coupon.discountPct > 0 && (
              <p className="text-green-600 mt-2 text-sm font-medium">
                ✅ Applied {coupon.code} (-{coupon.discountPct}%)
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            🛒 Order Summary
          </h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={item.productId.images?.[0]} 
                  alt={item.productId.name} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.productId.name}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <div className="text-sm">
                    <span className="text-gray-900">₹{Math.round(item.productId.price * (1 - (item.productId.discount || 0) / 100))}</span>
                    {item.productId.discount > 0 && (
                      <span className="text-gray-500 line-through ml-2">₹{Math.round(item.productId.price)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₹{Math.round(item.productId.price * (1 - (item.productId.discount || 0) / 100) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 border-t pt-4 text-gray-700">
            <p className="flex justify-between">
              <span>Subtotal ({items.length} items):</span>
              <span className="font-medium">₹{Math.round(totalBefore)}</span>
            </p>
            {coupon.discountPct > 0 && (
              <p className="flex justify-between text-green-600">
                <span>Coupon Discount:</span>
                <span>-₹{Math.round(totalBefore * (coupon.discountPct / 100))}</span>
              </p>
            )}
            <p className="flex justify-between text-gray-500">
              <span>Shipping:</span>
              <span>Free</span>
            </p>
            <p className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{Math.round(total)}</span>
            </p>
          </div>

          {/* Payment Buttons */}
          <div className="mt-8 flex flex-col gap-4">
            {!onlineOnly && (
              <button
                className="w-full py-3 rounded-2xl bg-gray-800 text-white font-medium 
                           hover:bg-gray-900 transition shadow-md"
                onClick={handleCOD}
              >
                💵 Cash on Delivery
              </button>
            )}
            <button
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-medium 
                         hover:bg-indigo-700 transition shadow-md"
              onClick={handleOnline}
            >
              💳 Pay Online
            </button>
          </div>

          {onlineOnly && (
            <p className="text-sm text-red-500 mt-4">
              ⚠️ Outside Hyderabad, online payment is required.
            </p>
          )}
        </div>
      </div>

      {/* ✅ COD Confirmation Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm relative overflow-hidden ">
            <h2 className="text-2xl font-bold text-green-600">
              🎉 Order Confirmed!
            </h2>
            <p className="text-gray-600 mt-2">
              Your COD order has been placed successfully.
            </p>

            {/* Bubble animation */}
            <div className="absolute inset-0 -z-10">
              {[...Array(15)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-3 h-3 bg-green-400 rounded-full animate-bubble"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    animationDelay: `${Math.random()}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <a 
        href="https://wa.me/918125914279" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 bg-[#25D366] text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg hover:bg-[#20BA5C] transition-colors z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>
    </div>
  );
}
