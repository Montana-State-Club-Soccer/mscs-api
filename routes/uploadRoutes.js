const express = require('express');
const multer = require('multer');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { uploadBuffer, isConfigured } = require('../services/storage');

const router = express.Router();

// Memory storage since we stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const allowedMime = /^image\/(png|jpe?g|gif|webp)$/i;

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    if (!allowedMime.test(req.file.mimetype)) return res.status(400).json({ message: 'Unsupported file type' });
    if (!isConfigured()) return res.status(500).json({ message: 'Cloud storage not configured' });

    const { url } = await uploadBuffer(req.file.buffer, req.file.originalname);
    return res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
