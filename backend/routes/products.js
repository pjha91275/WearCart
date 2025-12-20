const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('internal'), createProduct);
router.put('/:id', protect, authorize('internal'), updateProduct);
router.delete('/:id', protect, authorize('internal'), deleteProduct);
router.put('/:id/stock', protect, authorize('internal'), updateStock);

module.exports = router;

