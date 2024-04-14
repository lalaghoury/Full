const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    newsletter: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",
    },
    resetToken: { type: String, default: "" },
    resetTokenExpiration: { type: Date, default: null },
    status: { type: String, default: "active" },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    provider: {
      type: String,
      default: "local",
      enum: ["local", "google", "facebook", "discord"],
    },
    // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
