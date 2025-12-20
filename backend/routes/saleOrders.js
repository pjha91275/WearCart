const express = require('express');
const router = express.Router();
const {
  createSaleOrder,
  getSaleOrders,
  getSaleOrder,
  createInvoice
} = require('../controllers/saleOrderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createSaleOrder);
router.get('/', protect, getSaleOrders);
router.get('/:id', protect, getSaleOrder);
router.post('/:id/invoice', protect, authorize('internal'), createInvoice);

module.exports = router;

