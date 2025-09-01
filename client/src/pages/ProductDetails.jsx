import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../store/useCart'
import { ShoppingBag } from 'lucide-react'

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const cart = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get('/api/products/' + id);
        console.log('Fetched product:', data); // Debug log
        setP(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 p-4">
      <p>{error}</p>
    </div>
  );

  if (!p) return (
    <div className="text-center text-gray-600 p-4">
      <p>Product not found</p>
    </div>
  );

  const price = p.price * (1 - (p.discount || 0) / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="card overflow-hidden rounded-lg shadow-lg bg-white">
            <img 
              src={p.images?.[selectedImage] || 'https://via.placeholder.com/600x800?text=Shaivyah'} 
              alt={p.name} 
              className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {p.images?.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${p.name} - view ${idx + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
                  selectedImage === idx ? 'border-brand-600 shadow-md' : 'border-transparent hover:border-brand-300'
                }`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-sm font-medium">
                {p.category}
              </span>
              {p.fabric && (
                <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {p.fabric}
                </span>
              )}
              {p.color && (
                <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {p.color}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-brand-600">₹{price.toFixed(0)}</span>
              {p.discount > 0 && (
                <span className="text-lg text-gray-500 line-through">₹{p.price}</span>
              )}
              {p.discount > 0 && (
                <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                  {p.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {p.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{p.description}</p>
            </div>
          )}

          {p.occasion && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Perfect For</h3>
              <p className="text-gray-600">{p.occasion}</p>
            </div>
          )}

          <button
            onClick={() => cart.add(p, 1)}
            className="w-full bg-brand-600 text-white py-3 px-6 rounded-lg hover:bg-brand-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
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
