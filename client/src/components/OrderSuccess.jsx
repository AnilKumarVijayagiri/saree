import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import TestimonialCarousel from '../components/TestimonialCarousel';

export default function OrderSuccess({ orderId, total }) {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Load some testimonials
    const loadTestimonials = async () => {
      try {
        const { data } = await api.get('/api/testimonials');
        setTestimonials(data.filter(t => t.approved).slice(0, 3));
      } catch (err) {
        console.error('Error loading testimonials:', err);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
        <p className="text-gray-600 mt-2">Thank you for shopping with us.</p>
        <div className="mt-4 text-gray-600">
          <p>Order ID: <span className="font-semibold">{orderId}</span></p>
          <p>Total Amount: <span className="font-semibold">₹{total}</span></p>
        </div>
      </div>

      <div className="bg-brand-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-brand-600 mb-4">Share Your Experience</h2>
        <p className="text-gray-600 mb-4">We'd love to hear about your shopping experience!</p>
        <Link 
          to={`/review/${orderId}`}
          className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
        >
          Write a Review
        </Link>
      </div>

      {testimonials.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Customers Say</h2>
          <TestimonialCarousel items={testimonials} />
        </div>
      )}

      <div className="text-center mt-8">
        <Link 
          to="/"
          className="text-brand-600 hover:text-brand-700 font-medium"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
