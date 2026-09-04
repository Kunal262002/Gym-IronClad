import Trainer from '../models/Trainer.js';

/** @desc Get all trainers | @route GET /api/trainers */
export const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (error) {
    next(error);
  }
};

/** @desc Get a single trainer | @route GET /api/trainers/:id */
export const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

/** @desc Create a trainer (admin only) | @route POST /api/trainers */
export const createTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.create({
      ...req.body,
      photoUrl: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : req.body.photoUrl,
    });
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

/** @desc Update a trainer (admin only) | @route PUT /api/trainers/:id */
export const updateTrainer = async (req, res, next) => {
  try {
    const updates = {
      ...req.body,
      ...(req.file && { photoUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` }),
    };
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

/** @desc Delete a trainer (admin only) | @route DELETE /api/trainers/:id */
export const deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, message: 'Trainer removed' });
  } catch (error) {
    next(error);
  }
};
