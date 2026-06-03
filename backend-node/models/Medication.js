import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: String,
  time: String,
  times: [String],
  instructions: String,
  color: String,
  stock: { type: Number, default: 0 },
  userId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Medication', medicationSchema);
