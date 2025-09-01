import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../lib/api'

export default function Review(){
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [f, setF] = useState({ 
    name: '', 
    rating: 5, 
    message: '' 
  })

  const validate = () => {
    if (!f.name.trim()) {
      setError('Please enter your name')
      return false
    }
    if (!f.message.trim()) {
      setError('Please enter your review message')
      return false
    }
    if (f.rating < 1 || f.rating > 5) {
      setError('Rating must be between 1 and 5')
      return false
    }
    return true
  }

  const submit = async () => {
    try {
      setError('')
      if (!validate()) return

      setLoading(true)
      await api.post('/api/testimonials', { 
        ...f, 
        orderId,
        status: 'pending' // explicitly set status
      })
      
      alert('Thank you! Your review has been submitted for approval.')
      navigate('/orders') // redirect to orders page
    } catch (error) {
      console.error('Error submitting review:', error)
      setError(error.response?.data?.message || 'Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-bold">Leave a Review</h1>
      <p className="mt-2 text-gray-600">Your review helps others make better choices. It will be visible after admin approval.</p>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input 
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
            placeholder="Enter your name" 
            value={f.name} 
            onChange={e => setF({...f, name: e.target.value})}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(num => (
              <button
                key={num}
                className={`text-2xl ${f.rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setF({...f, rating: num})}
                disabled={loading}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea 
            className="w-full border rounded-xl px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
            placeholder="Tell us about your experience..." 
            value={f.message} 
            onChange={e => setF({...f, message: e.target.value})}
            disabled={loading}
          />
        </div>

        <button 
          className={`btn w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
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
  )
}
