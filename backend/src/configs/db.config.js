// Database
const mongoose = require("mongoose");

// Set up mongoose connection
mongoose.set("strictQuery", false);
const dev_db_uri = "mongodb+srv://chat_admin:ystimokk%21devchat@toy-cluster.hurkuyz.mongodb.net/Messaging_app?retryWrites=true&w=majority&appName=Toy-cluster/";
const mongoDB = process.env.MONGODB_URI || dev_db_uri;

async function connectDB() {
    await mongoose.connect(mongoDB)
    .then(() => console.log("connected to my database"))
    .catch((err) => console.log(err));
}

module.exports = connectDB;