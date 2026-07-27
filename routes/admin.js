// routes/admin.js
const express = require('express');
const ctrl = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin); // every route below requires a logged-in admin

// Orders
router.get('/orders', ctrl.listOrders);
router.patch('/orders/:id/status', ctrl.updateOrderStatus);
router.put('/orders/:id/assign-delivery', ctrl.assignDeliveryBoy);

// Delivery boys
router.get('/delivery-boys', ctrl.listDeliveryBoys);
router.post('/delivery-boys', ctrl.addDeliveryBoy);
router.patch('/delivery-boys/:id', ctrl.updateDeliveryBoy);

// Users
router.get('/users', ctrl.listUsers);

// Printer fleet
router.get('/fleet', ctrl.listPrinters);
router.post('/fleet/add', ctrl.addPrinter);
router.delete('/fleet/:id', ctrl.deletePrinter);
router.post('/fleet/control', ctrl.controlPrinter);
router.post('/fleet/dispatch', ctrl.dispatchJob);

// Filament inventory
router.get('/inventory', ctrl.listFilaments);
router.post('/inventory', ctrl.addFilament);
router.patch('/inventory/:id', ctrl.restockFilament);

// AI order insights
router.post('/analyze-print', ctrl.analyzeOrder);

module.exports = router;
