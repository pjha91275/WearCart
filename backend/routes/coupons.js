const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons, createDiscount } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/', protect, authorize('internal'), getCoupons);
router.post('/', protect, authorize('internal'), createDiscount);

module.exports = router;

