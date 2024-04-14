const Type = require("../models/Type");

const typeController = {
  listTypes: async (req, res) => {
    try {
      const types = await Type.find();
      if (!types) {
        return res
          .status(404)
          .json({ message: "No types found", success: false });
      }
      res.json({
        success: true,
        message: "Types fetched successfully",
        types,
      });
    } catch (error) {
      res.status(500).json({ error, success: false });
    }
  },

  listTypesNames: async (req, res) => {
    try {
      const typesNames = await Type.find({}, { name: 1, _id: 1 });

      if (!typesNames) {
        return res
          .status(404)
          .json({ message: "No types found", success: false });
      }

      res.json({
        success: true,
        message: "Types fetched successfully",
        typesNames,
      });
    } catch (error) {
      res.status(500).json({ error, success: false, message: "Error" });
    }
  },

  createType: async (req, res) => {
    try {
      const type = new Type(req.body);
      const newType = await type.save();
      if (!newType) {
        return res
          .status(400)
          .json({ message: "Type creation failed", success: false });
      }
      res.status(201).json({
        success: true,
        message: "Type created successfully",
        type: newType,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error, message: "Type creation failed", success: false });
    }
  },

  readType: async (req, res) => {
    const { typeId } = req.params;
    try {
      const type = await Type.findById(typeId);
      if (!type) {
        return res
          .status(404)
          .json({ message: "Type not found", success: false });
      }
      res.json({
        type,
        success: true,
        message: "Type fetched successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Type fetch failed", success: false });
    }
  },

  updateType: async (req, res) => {
    const { typeId } = req.params;
    try {
      const type = await Type.findByIdAndUpdate(typeId, req.body, {
        new: true,
      });
      if (!type) {
        return res
          .status(404)
          .json({ message: "Type not found", success: false });
      }
      res.json({
        type,
        success: true,
        message: "Type updated successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Type update failed", success: false });
    }
  },

  deleteType: async (req, res) => {
    const { typeId } = req.params;
    try {
      const type = await Type.findByIdAndRemove(typeId);
      if (!type) {
        return res
          .status(404)
          .json({ message: "Type not found", success: false });
      }
      res.json({ message: "Type deleted successfully.", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Type delete failed", success: false });
    }
  },
};

module.exports = typeController;
