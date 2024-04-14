const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../config/nodemailerConfig");
const User = require("../models/User");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User Not Found");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:5000/api/auth/twitter/callback",
    },
    async function (_, _, profile, done) {
      console.log("🚀 ~ profile:", profile);

      //   try {
      //     let user = await User.findOne({ email: profile.email });

      //     if (user && user.provider !== profile.provider) {
      //       return done(null, false, {
      //         message: `Email is already registered. Sign in with ${user.provider}..`,
      //         success: false,
      //       });
      //     }

      //     if (!user) {
      //       const salt = await bcrypt.genSalt(10);
      //       const hashedPassword = await bcrypt.hash(profile.id, salt);
      //       const user = await User.create({
      //         name: profile.username,
      //         email: profile.email,
      //         avatar: profile.avatar,
      //         password: hashedPassword,
      //         provider: "discord",
      //       });

      //       sendEmail(
      //         user.email,
      //         "Account Created",
      //         `Welcome ${user.name}! You have successfully created an account, Baobao.`
      //       );

      //       done(null, user);
      //       return;
      //     }

      //     const isMatch = await bcrypt.compare(profile.id, user.password);

      //     if (!isMatch) {
      //       return done(null, false, {
      //         message: "Invalid Credentials",
      //       });
      //     }

      //     done(null, user);
      //   } catch (error) {
      //     done(error, null);
      //   }
    }
  )
);

module.exports = passport;
