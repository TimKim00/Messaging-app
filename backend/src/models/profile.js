const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	displayName: { type: String },
	bio: { type: String },
	profilePicture: { type: String },
	email: { type: String },
	// feed: { type: }
}) // As Profile

module.exports = mongoose.model("Profile", ProfileSchema);
