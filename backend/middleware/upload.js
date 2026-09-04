import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    callback(null, `trainer-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return callback(null, true);
  return callback(new Error('Only JPG, PNG, and WebP images are supported'));
};

export const trainerImageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});