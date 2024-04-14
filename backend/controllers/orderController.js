const Order = require("../models/order");

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email avatar")
        .populate("products.productId", "name price")
        .populate("shipping_address");
      res.send({ orders, success: true, message: "All orders fetched" });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving order.",
      });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("user", "name email avatar")
        .populate("products.productId", "name price")
        .populate("shipping_address");
      res.send({ orders, success: true, message: "All orders fetched" });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving order.",
      });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        res.status(404).send({
          message: `Not found order with id ${req.params.id}.`,
        });
      } else {
        res.send({ order, success: true, message: "Order fetched" });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving order with id ${req.params.id}`,
      });
    }
  },
  updateOrder: async (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }

    try {
      const data = await Order.updateById(req.params.id, req.body);
      if (!data) {
        res.status(404).send({
          message: `Not found order with id ${req.params.id}.`,
        });
      } else {
        res.send(data);
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating order with id ${req.params.id}`,
      });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      await Order.remove(req.params.id);
      res.send({ message: `Order was deleted successfully!` });
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found order with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete Order with id ${req.params.id}`,
        });
      }
    }
  },
  createOrder: async (req, res) => {
    const order = new Order(req.body);
    try {
      const data = await order.save();
      res.send({ data, success: true, message: "Order created" });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating order.",
      });
    }
  },
};

module.exports = orderController;
