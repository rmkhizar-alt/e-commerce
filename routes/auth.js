const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, me, updateMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slow down brute-force attempts on login without affecting normal use
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts. Please try again in a few minutes.' }
});

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateMe);
router.post('/forgot-password', loginLimiter, forgotPassword);
router.post('/reset-password', loginLimiter, resetPassword);

module.exports = router;
