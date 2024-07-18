const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const passport = require("../configs/passport.config");
const { body, validationResult } = require("express-validator");
const { hashPassword } = require("../utils");

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
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("No username provided.")
    .isLength({ min: 6 })
    .escape()
    .withMessage("The username must be longer than 6 characters."),

  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("No password provided."),

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
      email: "",
      bio: "",
      profilePicture: "",
    });

    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Account successfully created",
        user: req.user,
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
