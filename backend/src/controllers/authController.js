const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Profile = require("../models/profile");
const passport = require("../configs/passport.config");
const validator = require("../middlewares/validator");
const { validationResult } = require("express-validator");
const { filterPrivateInfo, hashPassword } = require("../utils");

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({
        message: "Login successful",
        user: req.user,
        authenticated: req.isAuthenticated(),
      });
    });
  })(req, res, next);
};

exports.register = [
  // Validate and sanitize username and password.
  validator.checkUserCredentials(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const duplicateUser = await User.findOne({ username: username }).exec();
    if (duplicateUser) {
      const err = new Error("Invalid username");
      err.status = 409;
      return next(err);
    }

    const user = new User({
      username: username,
      h_password: hashPassword(password),
      rooms: [],
      friends: [],
      profileId: null,
    });

    // Create a new profile instance.
    const profile = new Profile({
      userId: user._id,
      displayName: username,
      email: "",
      bio: "",
      profilePicture: "",
    });

    user.profileId = profile._id;

    await profile.save();
    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Account successfully created",
        user: filterPrivateInfo(req.user),
        authenticated: req.isAuthenticated(),
      });
    });
  }),
];

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.json({
        message: "Logged out successfully",
      }); // Redirect to home page or login page
    });
  });
};
