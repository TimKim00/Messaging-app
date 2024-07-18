const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, requierd: true, min: 6 },
	h_password: { type: String, required: true}, //hashed password
	rooms: [{type: Schema.Types.ObjectId, ref: "Room"}],
	friends: [{type: Schema.Types.ObjectId, ref: "User"}],
	email: { type: String },
	bio: { type: String },
	profilePicture: { type: String },
});

// Method to compare the given password with the database hash
UserSchema.methods.verifyPassword = function(password) {
	return bcrypt.compareSync(password, this.h_password);
}

module.exports = mongoose.model("User", UserSchema);