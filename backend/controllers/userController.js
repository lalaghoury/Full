const User = require("../models/User");

module.exports = userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json({ users, success: true, message: "All users fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to get users", success: false });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json({ user, success: true, message: "User fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to get user", success: false });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      res.json({ user, success: true, message: "User fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to get user", success: false });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json({ user, success: true, message: "User updated" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to update user", success: false });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.json({ user, success: true, message: "User deleted" });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Failed to delete user",
        success: false,
      });
    }
  },
};
