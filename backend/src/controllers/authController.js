const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Profile = require("../models/profile");
const passport = require("../configs/passport.config");
const validator = require("../middlewares/validator");
const { validationResult } = require("express-validator");
const { filterPrivateInfo, hashPassword } = require("../utils");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username }).exec();
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.verifyPassword(password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(filterPrivateInfo(user._doc), JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  }); 

  return res.status(200).json({
    user: filterPrivateInfo(user._doc),
    token: token,
    message: "User successfully logged in.",
  })
});

exports.register = [
  validator.checkUserCredentials(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Check if the username already exists
    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create a new user instance
    const user = new User({
      username,
      h_password: hashedPassword,
      rooms: [],
      friends: [],
      profileId: null,
    });

    // Create a new profile instance
    const profile = new Profile({
      userId: user._id,
      displayName: username,
      email: '',
      bio: '',
      profilePicture: '',
    });

    // Save the user and profile to the database
    user.profileId = profile._id;
    await profile.save();
    await user.save();

    // Generate a JWT token for the new user
    const token = jwt.sign(filterPrivateInfo(user._doc), JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send the token and user data to the client
    return res.json({
      message: 'Account successfully created',
      token,
      user: filterPrivateInfo(user._doc),
    });
  }),
];

exports.logout = (req, res, next) => {
  res.json({
    message: 'Logout successful',
  });
};
