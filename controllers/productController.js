const Product = require("../models/Product");
const Category = require("../models/Category");
const Type = require("../models/Type");
const User = require("../models/User");

const productController = {
  listProducts: async (req, res) => {
    try {
      const products = await Product.find();
      if (!products) {
        return res
          .status(404)
          .json({ message: "No products found", success: false });
      }
      res.json({
        success: true,
        message: "Products fetched successfully",
        products: products.reverse(),
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error loading products", success: false });
    }
  },

  listFilteredProducts: async (req, res) => {
    const { minPrice, maxPrice, category, type, tags, query } = req.query;
    const filters = {};

    if (minPrice && maxPrice) {
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (category) {
      filters.category = category;
    }
    if (type) {
      filters.type = type;
    }
    if (tags && tags.length > 0) {
      const tagArray = tags.map((tag) => tag.trim().toLowerCase());
      filters.tags = { $all: tagArray };
    }
    if (query) {
      filters.$or = [
        { name: { $regex: query.trim().toLowerCase(), $options: "i" } },
        {
          description: {
            $regex: query.trim().toLowerCase(),
            $options: "i",
          },
        },
      ];
    }

    const products = await Product.find(filters);

    res.json({
      success: true,
      message: "Products fetched successfully",
      products: products.reverse(),
    });
  },

  listProductsNames: async (req, res) => {
    try {
      const productsNames = await Product.find({}, { name: 1, _id: 1 });

      if (!productsNames) {
        return res
          .status(404)
          .json({ message: "No products found", success: false });
      }

      res.json({
        success: true,
        message: "Products fetched successfully",
        productsNames,
      });
    } catch (error) {
      res.status(500).json({ error, success: false, message: "Error" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const category = await Category.findById(req.body.category);
      const type = await Type.findById(req.body.type);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      if (!type) {
        return res.status(404).json({
          success: false,
          message: "Type not found",
        });
      }

      const product = new Product(req.body);
      const newProduct = await product.save();

      category.products.push(newProduct._id);
      type.products.push(newProduct._id);

      await category.save();
      await type.save();

      res.status(201).json({
        success: true,
        message: "product created successfully",
        newProduct,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error, message: "Product creation failed", success: false });
    }
  },

  readWishlistProducts: async (req, res) => {
    try {
      const products = await Product.find({
        wishlists: req.user.userId,
      }).lean();

      res.status(200).json({
        products: products.reverse(),
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  readWishlistProductsCount: async (req, res) => {
    try {
      const products = await Product.find({
        wishlists: req.user.userId,
      }).lean();

      res.status(200).json({
        count: products.length,
        success: true,
        message: "Wishlist products count fetched successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  readProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }
      res.json({
        product,
        success: true,
        message: "Product fetched successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Product fetch failed", success: false });
    }
  },

  updateProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }

      const productCategory = await Category.findById(product.category);
      const productType = await Type.findById(product.type);

      if (productCategory._id !== req.body.category) {
        productCategory.products.pull(product._id);
        const category = await Category.findById(req.body.category);
        category.products.push(product._id);
        await productCategory.save();
        await category.save();
      }

      if (productType._id === req.body.type) {
        productType.products.pull(product._id);
        const type = await Type.findById(req.body.type);
        type.products.push(product._id);
        await productType.save();
        await type.save();
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      res.json({
        updatedProduct,
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Product update failed", success: false });
    }
  },

  deleteProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findByIdAndRemove(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }

      const category = await Category.findOne({ name: product.category });
      const type = await Type.findOne({ name: product.type });

      category.products.pull(product._id);
      type.products.pull(product._id);

      await category.save();
      await type.save();
      res.json({
        message: "Product deleted successfully.",
        success: true,
        deletedProduct: product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Product delete failed", success: false });
    }
  },

  addToWishlist: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send({ message: "product not found" });
      }

      if (
        user.wishlists.includes(productId) ||
        product.wishlists.includes(userId)
      ) {
        return res.status(409).send({
          message: "product is already in the wishlist",
        });
      }

      user.wishlists.push(productId);
      product.wishlists.push(userId);

      await product.save();
      await user.save();

      res.status(200).send({
        message: "product added to wishlist successfully",
        success: true,
        count: user.wishlists.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  removeFromWishlist: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!productId || !userId) {
      return res.status(400).send({
        message: "productId and userId are required",
      });
    }

    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (!product) {
        return res.status(404).send({ message: "product not found" });
      }

      if (
        !user.wishlists.includes(product._id) ||
        !product.wishlists.includes(user._id)
      ) {
        return res.status(409).send({
          message: "product is not in the wishlist",
        });
      }

      product.wishlists = product.wishlists.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.wishlists = user.wishlists.filter(
        (id) => id.toString() !== productId.toString()
      );

      await product.save();
      await user.save();

      res.status(200).send({
        message: "product removed from wishlist successfully",
        success: true,
        count: user.wishlists.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getSearchedProducts: async (req, res) => {
    const { query } = req.query;
    try {
      const products = await Product.find({
        name: { $regex: query, $options: "i" },
      }).lean();
      res.status(200).json({
        products: products.reverse(),
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = productController;
