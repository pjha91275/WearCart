const { CouponCode, DiscountOffer, Contact } = require('../models');
const { Op } = require('sequelize');

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, contactId } = req.body;

    const coupon = await CouponCode.findOne({
      where: { code },
      include: [{ model: DiscountOffer, as: 'discountOffer' }]
    });

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    // Check if already used
    if (coupon.status === 'used') {
      return res.status(400).json({ success: false, message: 'Coupon code already used' });
    }

    // Check expiration date
    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    // Check contact restriction
    if (coupon.contactId && coupon.contactId !== contactId) {
      return res.status(400).json({ success: false, message: 'Coupon code not valid for this customer' });
    }

    // Check discount offer dates
    const now = new Date();
    if (coupon.discountOffer.startDate > now || coupon.discountOffer.endDate < now) {
      return res.status(400).json({ success: false, message: 'Coupon code is not active' });
    }

    // Check if available on website
    if (coupon.discountOffer.availableOn !== 'website') {
      return res.status(400).json({ success: false, message: 'Coupon code not available on website' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountPercentage: coupon.discountOffer.discountPercentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all coupon codes
// @route   GET /api/coupons
// @access  Private/Internal
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await CouponCode.findAll({
      include: [
        { model: DiscountOffer, as: 'discountOffer' },
        { model: Contact, as: 'contact' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

