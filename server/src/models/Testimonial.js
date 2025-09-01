import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  name: String,
  message: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
