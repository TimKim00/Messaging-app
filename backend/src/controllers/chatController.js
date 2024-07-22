const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Room = require("../models/room");
const Message = require("../models/message");
const validator = require("../middlewares/validator");
const { validationResult } = require("express-validator");

exports.getAllChatrooms = asyncHandler(async (req, res, next) => {
  const [numRooms, allRooms] = await Promise.all([
    Room.countDocuments({}).exec(),
    Room.find().exec(),
  ]);

  return res.json({
    roomCount: numRooms,
    allChatrooms: allRooms,
  });
});

exports.createChatroom = [
  validator.checkRoomSchema(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomInfo } = req.body;

    const newRoom = new Room({
      ...roomInfo,
    });

    await newRoom.save();

    return res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  }),
];

exports.getChatroom = asyncHandler(async (req, res, next) => {
  const chatId = req.params.chatId;

  const chatRoom = await Room.findOne({ _id: chatId }).exec();
  if (!chatRoom) {
    return res.status(404).json("No room found.");
  }

  return res.status(200).json({ room: chatRoom });
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
    await roomInfo.save();

    return res.status(200).json({
      message: message,
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
