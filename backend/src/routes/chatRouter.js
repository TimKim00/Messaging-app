const express = require("express");
const router = express.Router();
const validateSession = require("../middlewares/auth");
const chatController = require("../controllers/chatController");

// GET request to retreive all chatrooms.
router.get('/', validateSession, chatController.getAllChatrooms);

// POST request to create a chatroom
router.post('/', validateSession, chatController.createChatroom);

// POST request to get the specific message information
router.post('/getMessages/', chatController.getMessages);

// GET request to retreive all chat room information.
router.get('/:chatId', validateSession, chatController.getChatroom);

// POST requet to send a message to the chatroom with chatId.
router.post('/:chatId', validateSession, chatController.sendMessage);

// PATCH request to modify the chatroom information.
router.patch('/:chatId', validateSession, chatController.updateChatroom);

// PATCH request to modify a message's content.
router.patch('/:chatId/:msgId', validateSession, chatController.updateMessage);

// DELETE request to remove a message from a chatroom.
router.delete('/:chatId/:msgId', validateSession, chatController.removeMessage);

module.exports = router;