// routes/deliveryRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/deliveryController');
const { requireDeliveryAuth } = require('../middleware/deliveryAuth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts. Please try again in a few minutes.' }
});

router.post('/login', loginLimiter, ctrl.login);

router.get('/orders', requireDeliveryAuth, ctrl.getMyOrders);
router.get('/orders/:id', requireDeliveryAuth, ctrl.getOrderDetail);
router.put('/orders/:id/start', requireDeliveryAuth, ctrl.startDelivery);
router.put('/orders/:id/generate-otp', requireDeliveryAuth, ctrl.generateOtp);
router.put('/orders/:id/deliver', requireDeliveryAuth, ctrl.confirmDelivery);
router.put('/location', requireDeliveryAuth, ctrl.updateLocation);

module.exports = router;
