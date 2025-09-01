import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true,
    unique: true,
    immutable: true // This ensures the ID can't be changed after creation
  },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: [String],
  fabric: String,
  color: String,
  occasion: String,
  category: { type: String, enum: ['Sarees', 'Kurtis', 'Kurti Sets', 'Ethnic Frocks', 'Other'], default: 'Sarees' },
  inStock: { type: Boolean, default: true },
  categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }  // avoid reserved 'category'
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
