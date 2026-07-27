const express = require('express');
const ctrl = require('../controllers/wishlistController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', ctrl.getWishlist);
router.put('/', ctrl.setWishlist);
router.post('/:productId', ctrl.addOne);
router.delete('/:productId', ctrl.removeOne);

module.exports = router;
