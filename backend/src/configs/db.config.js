// Database
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

async function connectDB() {
    await mongoose.connect(mongoDB)
    .then(() => console.log("connected to my database"))
    .catch((err) => console.log(err));
}

module.exports = connectDB;