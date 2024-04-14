const mongoose = require("mongoose");

const typeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: { type: String, required: true, default: "default.png" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Type", typeSchema);
