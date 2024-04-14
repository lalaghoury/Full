const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireSignin } = require("../middlewares/authMiddleware");

// Get All Products
router.get("/all", productController.listProducts);

// Get All Product Names
router.get("/names", productController.listProductsNames);

// GET Filtered Products
router.get("/filter", productController.listFilteredProducts);

//getProductsByUserWishlists
router.get(
  "/user-wishlist",
  requireSignin,
  productController.readWishlistProducts
);

///user-wishlist-count
router.get(
  "/user-wishlist-count",
  requireSignin,
  productController.readWishlistProductsCount
);

// Get Single Product
router.get("/:productId", productController.readProduct);

// Create New Product
router.post("/new", productController.createProduct);

// Create New Product
router.post(
  "/add-to-wishlist/:productId",
  requireSignin,
  productController.addToWishlist
);

// Create New Product
router.post(
  "/remove-from-wishlist/:productId",
  requireSignin,
  productController.removeFromWishlist
);

// Update Product
router.put("/edit/:productId", productController.updateProduct);

// Delete Product
router.delete("/:productId", productController.deleteProduct);

module.exports = router;
