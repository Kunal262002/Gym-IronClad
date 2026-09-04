import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const sendResetEmail = async (user, resetUrl) => {
  if (!process.env.SMTP_HOST) {
    console.log(`Password reset URL for ${user.email}: ${resetUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: 'Reset your IRONCLAD password',
    text: `Use this link to reset your password. It expires in 1 hour: ${resetUrl}`,
  });
};

/**
 * @desc  Register a new member
 * @route POST /api/auth/register
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipPlan: user.membershipPlan,
        membershipStartedAt: user.membershipStartedAt,
        membershipExpiresAt: user.membershipExpiresAt,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Authenticate a member and return a token
 * @route POST /api/auth/login
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password').populate('membershipPlan');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipPlan: user.membershipPlan,
        membershipStartedAt: user.membershipStartedAt,
        membershipExpiresAt: user.membershipExpiresAt,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const response = { success: true, message: 'If an account exists for that email, a reset link has been sent.' };
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.json(response);

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;
    await sendResetEmail(user, resetUrl);
    if (process.env.RETURN_RESET_LINK === 'true') response.resetUrl = resetUrl;
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get the currently authenticated user's profile
 * @route GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('membershipPlan')
      .populate({
        path: 'bookedClasses',
        populate: { path: 'trainer', select: 'name specialty' },
      });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all users with membership and booking details
 * @route GET /api/auth/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('membershipPlan')
      .populate({
        path: 'bookedClasses',
        populate: { path: 'trainer', select: 'name specialty' },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};
