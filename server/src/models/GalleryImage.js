import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  title: String,
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('GalleryImage', galleryImageSchema);
