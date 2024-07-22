const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	roomId: { type: Schema.Types.ObjectId, required: true, ref: "Room"}, 
	message: { type: String, required: true },
	isImage: { type: Boolean, default: false},
	createTime: { type: Date },
	flagged: { type: Boolean, default: false},
}) 

module.exports = mongoose.model("Message", MessageSchema);