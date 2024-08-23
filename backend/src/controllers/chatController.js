const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Room = require("../models/room");
const Message = require("../models/message");
const validator = require("../middlewares/validator");
const { validationResult } = require("express-validator");
const { filterPrivateInfo } = require("../utils");

exports.getAllChatrooms = asyncHandler(async (req, res, next) => {
  const allRooms = await Room.find({ users: req.user._id })
    .populate("recentMessage")
    .populate("users")
    .sort({ updateTime: -1 })
    .exec();
  const filteredRooms = allRooms.map((room) => {
    // Convert room document to plain JavaScript object
    const plainRoom = room.toObject();

    // Filter users' private information
    plainRoom.users = plainRoom.users.map((user) => filterPrivateInfo(user));

    return plainRoom;
  });

  return res.json({
    roomCount: filteredRooms.length,
    allChatrooms: filteredRooms,
  });
});

exports.createChatroom = [
  // validator.checkRoomSchema(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomInfo } = req.body;
    const { users } = roomInfo.users;

    // Check if users exist
    users.forEach(async (user) => {
      const existingUser = await User.findOne({ _id: user }).exec();
      if (!existingUser) return res.status(404).json("Invalid users");
    });

    // Check if room already exists
    const roomExists = await Room.findOne({ users: users }).exec();
    if (roomExists) {
      return res
        .status(200)
        .json({ message: "Room already exists.", room: roomExists });
    }

    const newRoom = new Room({
      ...roomInfo,
    });

    await newRoom.save();

    await Promise.all(
      roomInfo.users.map((user) =>
        User.findOneAndUpdate(
          { _id: user },
          { $addToSet: { rooms: newRoom._id } } // Avoid duplicates
        ).exec()
      )
    );

    return res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  }),
];

exports.getChatroom = asyncHandler(async (req, res, next) => {
  const chatId = req.params.chatId;
  const query = { _id: chatId };
  const chatRoom = await Room.findOne(query).exec();

  if (!chatRoom) {
    return res.status(404).json("No room found.");
  }

  return res.status(200).json({ room: chatRoom });
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  const { messages } = req.body;
  const messageDocs = await Message.find({ _id: { $in: messages } }).exec();

  return res.status(200).json({ messageDocs: messageDocs });
});

exports.sendMessage = [
  validator.checkMessageSchema(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const roomId = req.params.chatId;
    const roomInfo = await Room.findById(roomId).exec();
    const messageInfo = req.body.messageInfo;

    if (!roomInfo) {
      return res.status(404).json("Invalid page");
    }

    const message = new Message({
      roomId: roomId,
      createTime: new Date(),
      ...messageInfo,
    });

    roomInfo.messages.unshift(message._id);
    await message.save();

    roomInfo.recentMessage = message._id;
    roomInfo.updateTime = new Date();
    await roomInfo.save();

    return res.status(200).json({
      messageInfo: message,
      roomInfo: roomInfo,
      message: "Successfully added a message.",
    });
  }),
];

exports.updateChatroom = [
  validator.checkRoomSchema(),
  asyncHandler(async (req, res, next) => {
    const roomInfo = await Room.findOneAndUpdate(
      { _id: req.params.chatId },
      req.body.roomInfo,
      { new: true }
    ).exec();

    if (!roomInfo) {
      return res.status(404).json("Invalid page");
    }

    return res
      .status(200)
      .json({ message: "Room updated Successfully", room: roomInfo });
  }),
];

exports.removeMessage = asyncHandler(async (req, res, next) => {
  const roomId = req.params.chatId;
  const msgId = req.params.msgId;

  const roomInfo = await Room.findOne({ _id: roomId });
  if (!roomInfo) {
    return res.status(404).json("Invalid page");
  }

  if (!roomInfo.messages.includes(msgId)) {
    return res.status(404).json("Invalid page");
  }

  roomInfo.messages.pull(msgId);
  roomInfo.updateTime = new Date();
  roomInfo.recentMessage = roomInfo.messages[0];
  await Message.deleteOne({ _id: msgId }).exec();
  await roomInfo.save();

  return res
    .status(200)
    .json({ message: "Message removed successfully", room: roomInfo });
});

exports.updateMessage = asyncHandler(async (req, res, next) => {
  const roomId = req.params.chatId;
  const msgId = req.params.msgId;
  const { messageInfo } = req.body;

  const roomInfo = await Room.findOne({ _id: roomId });
  if (!roomInfo) {
    return res.status(404).json("Invalid page");
  }

  if (!roomInfo.messages.includes(msgId)) {
    return res.status(404).json("Invalid page");
  }

  const newMessage = await Message.findOneAndUpdate(
    { _id: msgId, userId: messageInfo.userId },
    { message: messageInfo.message },
    { new: true }
  ).exec();

  return res
    .status(200)
    .json({ message: "Message updated successfully", message: newMessage });
});
