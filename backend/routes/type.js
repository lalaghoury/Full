const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeController");

// Get All Types
router.get("/all", typeController.listTypes);

// Gett All Types Names
router.get("/names", typeController.listTypesNames);

// Get Single Type
router.get("/:typeId", typeController.readType);

// Create New Type
router.post("/new", typeController.createType);

// Update Type
router.put("/:typeId", typeController.updateType);

// Delete Type
router.delete("/:typeId", typeController.deleteType);

module.exports = router;
