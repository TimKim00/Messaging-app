const { filterPrivateInfo } = require("../utils");
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

// Handles /users/ 
// GET request to retreive all users' public information.
router.get('/', asyncHandler(async (req, res, next) => {
    const allUsers = await User.find().exec();
    const filteredUsers = allUsers.map((user) => filterPrivateInfo(user.toObject()));
    res.json({ allUsers: filteredUsers });
}))

module.exports = router;