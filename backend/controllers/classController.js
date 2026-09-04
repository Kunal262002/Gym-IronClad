import ClassSchedule from '../models/ClassSchedule.js';
import User from '../models/User.js';

/** @desc Get all classes | @route GET /api/classes */
export const getClasses = async (req, res, next) => {
  try {
    const classes = await ClassSchedule.find().populate('trainer', 'name specialty photoUrl');
    res.json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

/** @desc Create a class (admin only) | @route POST /api/classes */
export const createClass = async (req, res, next) => {
  try {
    const newClass = await ClassSchedule.create(req.body);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};

/** @desc Update a class (admin only) | @route PUT /api/classes/:id */
export const updateClass = async (req, res, next) => {
  try {
    const updated = await ClassSchedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/** @desc Delete a class (admin only) | @route DELETE /api/classes/:id */
export const deleteClass = async (req, res, next) => {
  try {
    const deleted = await ClassSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.json({ success: true, message: 'Class removed' });
  } catch (error) {
    next(error);
  }
};

/** @desc Book a spot in a class | @route POST /api/classes/:id/book */
export const bookClass = async (req, res, next) => {
  try {
    const classSchedule = await ClassSchedule.findById(req.params.id);
    if (!classSchedule) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    const user = await User.findById(req.user._id);
    if ((user.bookedClasses || []).some((classId) => classId.equals(classSchedule._id))) {
      return res.status(400).json({ success: false, message: 'You already booked this class' });
    }
    if (classSchedule.spotsBooked >= classSchedule.capacity) {
      return res.status(400).json({ success: false, message: 'This class is fully booked' });
    }
    classSchedule.spotsBooked += 1;
    await classSchedule.save();
    user.bookedClasses = user.bookedClasses || [];
    user.bookedClasses.push(classSchedule._id);
    await user.save();
    res.json({ success: true, data: classSchedule });
  } catch (error) {
    next(error);
  }
};
