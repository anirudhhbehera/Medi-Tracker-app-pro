import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  medicationId: { type: String, required: true },
  medicationName: { type: String, required: true },
  time: { type: String, required: true },
  days: [String],
  enabled: { type: Boolean, default: true },
  soundEnabled: { type: Boolean, default: true },
  userId: { type: String, required: true },
  lastTaken: Date
}, { timestamps: true });

export default mongoose.model('Reminder', reminderSchema);
