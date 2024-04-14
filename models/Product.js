const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Type",
    },
    description: {
      type: String,
      required: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    images: [
      {
        name: {
          type: String,
          required: true,
          default: "image1.jpg",
        },
        url: {
          type: String,
          required: true,
          default:
            "https://res.cloudinary.com/dslrkvmwn/image/upload/v1710662389/images/e95plvwwibetuyvwmcxe.jpg",
        },
      },
    ],
    sku: {
      type: String,
    },
    barcode: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    allow_backorder: {
      type: Boolean,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    length: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    wishlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
