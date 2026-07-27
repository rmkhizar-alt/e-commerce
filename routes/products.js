const express = require('express');
const ctrl = require('../controllers/productController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public - anyone browsing the store
router.get('/', ctrl.list);
router.get('/meta/categories', ctrl.categories);
router.get('/:id/related', ctrl.related);
router.get('/:id', ctrl.getOne);

// Admin only - managing the catalog
router.post('/', requireAuth, requireAdmin, ctrl.create);
router.put('/:id', requireAuth, requireAdmin, ctrl.update);
router.delete('/:id', requireAuth, requireAdmin, ctrl.remove);

module.exports = router;
