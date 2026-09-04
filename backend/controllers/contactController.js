import Contact from '../models/Contact.js';

/** @desc Submit a contact form message | @route POST /api/contact */
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

/** @desc Get all contact submissions (admin only) | @route GET /api/contact */
export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};
