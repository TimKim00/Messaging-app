const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Room = require("../models/room");
const validator = require("../middlewares/validator");
const { filterPrivateInfo } = require("../utils");

// Retreives user information. req.body should have "pageNum" and
// "pageSize" fields to specify the page of users. For now, just return all users.
exports.getUsers = [
  asyncHandler(async (req, res, next) => {
    const [numUsers, allUsers] = await Promise.all([
      User.countDocuments({}).exec(),
      User.find().exec(),
    ]);

    const filteredUsers = allUsers.map((user) => filterPrivateInfo(user._doc));
    
    res.json({
      userCount: numUsers,
      allUsers: filteredUsers,
    });
  }),
];

// Gets all the friends of this user.
exports.getFriends = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.friends.length === 0) {
    return [];
  }

  const friends = await User.find({ _id: { $in: user.friends } })
    .sort({ _id: 1 })
    .exec();
  return friends.map((friend) => filterPrivateInfo(friend));
});

// Adds the user with userId to the session user's friend list.
exports.addFriend = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  if (req.user.friends.includes(userId)) {
    return res.status(200).json({ message: "User already in friends." });
  }

  const newFriend = await User.findById(userId).exec();

  if (newFriend === null) {
    return res.status(404).json({ message: "No user found." });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { friends: userId } },
    { new: true }
  ).exec();

  req.user = updatedUser; // Manually update req.user
  req.session.passport.user = updatedUser;

  return res.status(200).json({ user: filterPrivateInfo(updatedUser) });
});

// Remove the friend from the session user's frined list.
exports.removeFriend = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  if (!req.user.friends.includes(userId)) {
    return res.status(200).json({ message: "User not in friends." });
  }

  const newFriend = await User.findById(userId).exec();

  if (newFriend === null) {
    return res.status(404).json({ message: "No user found." });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { friends: userId } },
    { new: true }
  ).exec();

  req.user = updatedUser; // Manually update req.user
  req.session.passport.user = updatedUser;

  return res.status(200).json({ user: filterPrivateInfo(updatedUser) });
});

// Gets the profile of the user.
exports.getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).exec();

  if (!user) {
    return res.status(404).json({ message: "No user found." });
  }

  return res.status(200).json({ user: filterPrivateInfo(user) });
});

// updates a user profile.
exports.updateProfile = [
  validator.checkProfileInfo(),
  
  asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: "No user found." });
    }

    return res.status(200).json({ user: filterPrivateInfo(user) });
  }),
];
