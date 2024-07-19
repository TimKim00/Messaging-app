const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	userId: { type: Schema.Type.ObjectId, required: true, ref: "User" },
	roomId: { type: Schema.Type.ObjectId, required: true, ref: "Room"}, 
	message: { type: String, required: true },
	isImage: { type: Bool, default: false},
	createTime: { type: Date },
	flagged: { type: Bool, default: false},
}) 

module.exports = mongoose.model("Message", MessageSchema);