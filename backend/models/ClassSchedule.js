import mongoose from 'mongoose';

const classScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 15 },
    capacity: { type: Number, required: true, min: 1 },
    spotsBooked: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ClassSchedule', classScheduleSchema);
