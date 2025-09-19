import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  market: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'birr/kg' },
  currency: { type: String, default: 'ETB' },
  submittedBy: { type: String, default: 'anonymous' }, // later store userId
  submittedAt: { type: Date, default: Date.now },
  votes: { up: { type: Number, default: 0 }, down: { type: Number, default: 0 } },
  reports: { type: Number, default: 0 },
  sourceType: { type: String, enum: ['user','agent','admin'], default: 'user' },
  status: { type: String, enum: ['pending','confirmed','flagged'], default: 'pending' }
});

export default mongoose.model('Price', priceSchema);
