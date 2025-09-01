import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected:', conn.connection.host);
  } catch (e) {
    console.error('MongoDB error:', e.message);
    process.exit(1);
  }
};
