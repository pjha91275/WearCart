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
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('internal'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('internal'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('internal'), deleteProduct);
router.put('/:id/stock', protect, authorize('internal'), updateStock);

module.exports = router;

