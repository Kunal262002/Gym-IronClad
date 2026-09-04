import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    experienceYears: { type: Number, required: true, min: 0 },
    photoUrl: { type: String, default: '' },
    social: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Trainer', trainerSchema);
