const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const validateSession = require("../middlewares/auth");

// Handles /users/ 
// GET request to retreive all users' public information.
router.get('/', validateSession, userController.getUsers);

// GET request to retreive all the user's friends.
router.get('/friends/', validateSession, userController.getFriends);

// POST request to add a user to the user's friend list. 
router.post('/friends/:userId', validateSession, userController.addFriend);

// DELETE request to remove a user from the user's friend list.
router.delete('/friends/:userId', validateSession, userController.removeFriend);

// // GET request to get the user's profile information
// router.get('profile/:userId', validateSession, userController.getProfile);

// // PATCH request to modify the user's profile information.
// router.patch('profile/:userId', validateSession, userController.updateProfile);

module.exports = router;