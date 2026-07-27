const express = require('express');
const ctrl = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth); // every cart route needs a logged-in user

router.get('/', ctrl.getCart);
router.post('/items', ctrl.addItem);
router.put('/items/:productId', ctrl.updateItem);
router.delete('/items/:productId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);
router.post('/sync', ctrl.syncCart);

module.exports = router;
