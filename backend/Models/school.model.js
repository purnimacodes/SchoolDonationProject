import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  slNo: { type: Number },
  name: { type: String, required: true },
  block: { type: String, required: true }, // mapping to the block
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  }
}, { timestamps: true });

export const School = mongoose.model('School', schoolSchema);
