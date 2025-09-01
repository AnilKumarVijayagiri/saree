import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPct: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  expiresAt: Date,
  sourceTag: String // e.g., 'instagram', 'website'
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
