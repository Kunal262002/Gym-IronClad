import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    perks: [{ type: String }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('MembershipPlan', membershipPlanSchema);
