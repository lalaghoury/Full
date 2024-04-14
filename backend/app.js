const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
require("dotenv").config();
const session = require("express-session");

// Middlewares
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "strict",
    },
  })
);
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(passport.initialize());
app.use(passport.session());

// Routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const imageRouter = require("./routes/image");
const categoryRouter = require("./routes/category");
const typeRouter = require("./routes/type");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const couponRoute = require("./routes/coupon");
const addressRoute = require("./routes/address");
const braintreeRoute = require("./routes/braintree");
// const path = require("path");

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/images", imageRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/types", typeRouter);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/address", addressRoute);
app.use("/api/checkout", braintreeRoute);
app.get("/", (req, res) => {
  res.send("hello");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`Database connected`);
    app.listen(PORT, () => {
      console.log(`Backend server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
