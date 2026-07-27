// routes/admin.js
const express = require('express');
const ctrl = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin); // every route below requires a logged-in admin

router.get('/orders', ctrl.listOrders);
router.patch('/orders/:id/status', ctrl.updateOrderStatus);
router.get('/users', ctrl.listUsers);

module.exports = router;
