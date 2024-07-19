const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	name: { type: String, required: true},
	tags: { type: String, required: true, enum: ["Sports", "Gaming", "Politics", "Others"], default: "Others"},
	users: [{type: Schema.Types.ObjectId, ref: "User"}],
	messages: [{type: Schema.Types.ObjectId, ref: "Message"}],
	recentMessage: { type: Schema.Types.ObjectId, ref: "Message" },
	private: { type: Boolean, default: false },
	accessCode: { type: String },
	isGroup: {type: Boolean, default: false },
	createTime: { type: Date, required: true },
	updateTime: { type: Date, required: true },
});

// Method to compare the given password with the database hash
RoomSchema.virtual('displayInfo').get(function() {
    return {
        name: this.name,
        tags: this.tags,
        recentMessage: this.recentMessage,
        private: this.private,
        isGroup: this.isGroup,
        updateTime: this.updateTime
    };
});

module.exports = mongoose.model("Room", RoomSchema);