const Coupon = require("../models/Coupon");

const couponMiddleware = {
  applyCoupon: async (req, res, next) => {
    const { couponCode } = req.body;
    try {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      req.discount = coupon.discountPercent;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
module.exports = couponMiddleware;
