const validator = require("../middlewares/validator");
const asyncHandler = require("express-async-handler");
const Profile = require("../models/profile");
const mongoose = require("mongoose");

exports.getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const profile = await Profile.findOne({ userId: userId }).exec();

  if (!profile) {
    return res.status(401).json({ message: "No user found" });
  }

  return res.status(200).json({
    profile: profile,
    message: "Profiile successfully returned.",
  });
});

exports.updateProfile = [
  validator.checkProfileInfo(),
  asyncHandler(async (req, res, next) => {
    const { profileInfo } = req.body;
    const userId = req.params.userId;

    if (profileInfo.hasOwnProperty("userId")) {
      // We should filter out profileInfo from altering the user Id.
      delete profileInfo.userId;
    }

    if (userId != req.user._id) {
      // Cannot update someone else's profile.
      return res.status(403).json({ message: "Access Denied." });
    }

    // We only want to change the profile if it exists. ONly alter the fields given by profileInfo.
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { $set: profileInfo },
      { new: true }
    ).exec();

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ profile: updatedProfile });
  }),
];
