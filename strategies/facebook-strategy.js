const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
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
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
      scope: ["public_profile", "email"],
      usernameField: "email",
    },

    async function (_, _, profile, done) {
      console.log("🚀 ~ profile:", profile);
      try {
        let user = await User.findOne({ email: profile._json.email });

        if (user && user.provider !== "facebook") {
          return done(null, false, {
            message: `Email is already registered.`,
            success: false,
          });
        }

        if (!user) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(profile.id, salt);
          const user = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            avatar: profile._json.picture,
            password: hashedPassword,
            provider: "facebook",
          });
          sendEmail(
            user.email,
            "Account Created",
            `Welcome ${user.name}! You have successfully created an account , Baobao.`
          );
          done(null, user);
          return;
        }
        const userPassword = user.password;
        const isMatch = await bcrypt.compare(profile.id, userPassword);
        if (!isMatch) {
          return done(null, false, {
            message: "Invalid Credentials",
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
