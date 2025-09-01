import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'admin@shaivyah.store';
  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({ name: 'Admin', email, password: await bcrypt.hash('Admin@123', 10), role: 'admin' });
    console.log('✅ Admin created:', email, 'password: Admin@123');
  } else {
    console.log('ℹ️ Admin already exists');
  }
  await mongoose.disconnect();
};

run().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
