const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/', protect, authorize('internal'), getCoupons);

module.exports = router;

