// routes/liveChat.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/liveChatController');

const router = express.Router();

// Generous but sane cap so the widget can't be used to hammer Groq's API.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many messages — please slow down a little.' }
});

router.post('/', chatLimiter, ctrl.chat);
router.get('/:sessionId', ctrl.getHistory);

module.exports = router;
