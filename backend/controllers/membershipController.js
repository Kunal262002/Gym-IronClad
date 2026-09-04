import MembershipPlan from '../models/MembershipPlan.js';
import User from '../models/User.js';

/** @desc Get all membership plans | @route GET /api/memberships */
export const getPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find().sort({ price: 1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

/** @desc Create a membership plan (admin only) | @route POST /api/memberships */
export const createPlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

/** @desc Update a membership plan (admin only) | @route PUT /api/memberships/:id */
export const updatePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

/** @desc Delete a membership plan (admin only) | @route DELETE /api/memberships/:id */
export const deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, message: 'Plan removed' });
  } catch (error) {
    next(error);
  }
};

/** @desc Subscribe the logged-in user to a plan | @route POST /api/memberships/:id/subscribe */
export const subscribeToPlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const membershipStartedAt = new Date();
    const membershipExpiresAt = new Date(membershipStartedAt);
    if (plan.billingCycle === 'monthly') {
      membershipExpiresAt.setMonth(membershipExpiresAt.getMonth() + 1);
    } else {
      membershipExpiresAt.setFullYear(membershipExpiresAt.getFullYear() + 1);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { membershipPlan: plan._id, membershipStartedAt, membershipExpiresAt },
      { new: true }
    ).populate('membershipPlan');

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
