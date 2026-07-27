const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const ctrl = require('../controllers/contactController');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages sent. Please try again later.' }
});

// Attachments are kept in memory (never written to disk) and capped at
// 5MB per file, 5 files max, matching the limits enforced on the frontend.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }
});

// upload.array('attachment', 5) must run before contactLimiter/ctrl.create so
// that multipart/form-data fields (name, email, subject, message, etc.) get
// parsed into req.body — without multer, req.body would be empty for any
// request that includes file attachments.
router.post('/', upload.array('attachment', 5), contactLimiter, ctrl.create);

module.exports = router;
