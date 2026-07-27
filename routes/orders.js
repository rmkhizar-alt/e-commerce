const express = require('express');
const ctrl = require('../controllers/orderController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', optionalAuth, ctrl.createOrder); // guest checkout allowed
router.get('/', requireAuth, ctrl.myOrders); // must be logged in to list "my orders"
router.get('/:orderNumber', optionalAuth, ctrl.getOrder); // guests verify via email query param
router.patch('/:orderNumber/cancel', requireAuth, ctrl.cancelOrder); // customer cancels their own order

module.exports = router;
