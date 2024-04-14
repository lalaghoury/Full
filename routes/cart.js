const express = require("express");
const router = express.Router();

const { requireSignin } = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

// Add item to cart
router.post("/add", requireSignin, cartController.createCart);

// Get cart contents
router.get("/", requireSignin, cartController.listCart);

// Get count
router.get("/count", requireSignin, cartController.getCount);

// Update item quantity in cart
router.put("/update", requireSignin, cartController.updateCart);

// Remove item from cart
router.delete("/remove/:itemId", requireSignin, cartController.deleteCartItem);

module.exports = router;
