const express = require("express");
const router = express.Router();

const authController = require('../controllers/authController');

// POST request to log in a user if allowed.
router.post("/login", authController.login);

// POST requet to create a new user if allowed.
router.post("/register", authController.register);

// POST request to log out from the session
router.post("/logout", authController.logout);

module.exports = router;
