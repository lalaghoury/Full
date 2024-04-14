const Cart = require("../models/Cart");

const cartController = {
  listCart: async (req, res) => {
    const userId = req.user.userId;


    if (!userId) {
      return res.status(400).json({ message: "Please login to continue" });
    }

    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      res.json({ success: true, cart, message: "Cart fetched successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCount: async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "Please login to continue" });
    }

    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      res.json({ success: true, count: cart.items.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createCart: async (req, res) => {
    const { productId, quantity, price } = req.body;
    const userId = req.user.userId;

    if (!quantity || !productId || !price || !userId) {
      return res
        .status(400)
        .json({ message: "Something went wrong, please try again" });
    }

    try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (index !== -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart.price += price * quantity;
      cart.total += cart.price - cart.savings;

      await cart.save();
      res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        cart,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateCart: async (req, res) => {
    const { quantity, productId, price } = req.body;
    const { userId } = req.user;

    if (!quantity || !productId || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      let cart = await Cart.findOne({ userId }).populate("items.productId");

      const index = cart.items.findIndex(
        (item) => item.productId._id.toString() === productId.toString()
      );

      if (index !== -1) {
        const oldQuantity = cart.items[index].quantity;
        cart.items[index].quantity = quantity;

        const newPrice = price * (quantity - oldQuantity);

        cart.price += newPrice;
        cart.total = cart.price - cart.savings;

        await cart.save();
        res.json({
          cart,
          message: "Quantity updated successfully",
          success: true,
        });
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteCartItem: async (req, res) => {
    const userId = req.user.userId;
    const { itemId } = req.params;

    try {
      let cart = await Cart.findOne({ userId });
      cart.items = cart.items.filter(
        (item) => item._id.toString() !== itemId.toString()
      );
      await cart.save();
      res.json({
        cart,
        message: "Product removed from cart successfully",
        success: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Filed to delete item from cart",
        success: false,
        error: err.message,
      });
    }
  },
};

module.exports = cartController;
