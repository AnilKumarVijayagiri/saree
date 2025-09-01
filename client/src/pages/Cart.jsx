import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../store/useCart'
import { useAuth } from '../store/useAuth'

export default function Cart() {
  const cart = useCart()
  const auth = useAuth()
  const navigate = useNavigate()
  const [localLoading, setLocalLoading] = useState(true)

  // Load cart data when component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        await cart.load()
      } catch (err) {
        console.error('Failed to load cart:', err)
      } finally {
        setLocalLoading(false)
      }
    }
    loadCart()
  }, [])

  // Combine local and cart store loading states
  const isLoading = localLoading || cart.isLoading

  const handleUpdateQuantity = async (productId, qty) => {
    if (qty < 1) return;
    await cart.updateQuantity(productId, qty);
  }

  const handleRemoveItem = async (productId) => {
    if (confirm('Are you sure you want to remove this item?')) {
      await cart.remove(productId);
    }
  }

  const handleCheckout = () => {
    if (!auth.user) {
      // Save return URL and redirect to login
      localStorage.setItem('returnUrl', '/checkout');
      navigate('/auth/login');
      return;
    }
    navigate('/checkout');
  }

  console.log('Cart rendering, items:', cart.items)

  return (
    <div className="cart-page min-h-screen bg-white p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {cart.error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{cart.error}</p>
          <button 
            onClick={() => cart.load()}
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/" 
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.items.map(({product, qty}) => product ? (
            <div 
              key={product._id} 
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={product?.images?.[0] || 'https://via.placeholder.com/80'} 
                  alt={product?.name || 'Product Image'}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{product?.name || 'Product'}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => qty > 1 && handleUpdateQuantity(product?._id, qty - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                        disabled={qty <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{qty}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(product?._id, qty + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      × ₹{Math.round((product?.price || 0) * (1 - (product?.discount || 0)/100))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold">
                  ₹{Math.round((product?.price || 0) * (1 - (product?.discount || 0)/100) * qty)}
                </p>
                <button 
                  className="text-red-600 text-sm hover:text-red-800" 
                  onClick={() => product?._id && handleRemoveItem(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : null)}
          
          {/* Cart Summary */}
          <div className="mt-8 border-t pt-6 flex items-center justify-between">
            <div className="text-xl font-bold">
              Total: ₹{Math.round(cart.total())}
            </div>
            <button 
              onClick={handleCheckout}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Contact Button */}
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
  )
}
