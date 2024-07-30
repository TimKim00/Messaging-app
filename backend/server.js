// Libraries
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./src/configs/passport.config");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const FRONTEND_ADDRESS = "http://localhost:5173";

const app = express();

// Config files
const connectDB = require("./src/configs/db.config");

// Middlewares
const errorHandler = require("./src/middlewares/errorHandler");
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: FRONTEND_ADDRESS, credentials: true },
});

// Routers
const indexRouter = require("./src/routes/indexRouter");
const userRouter = require("./src/routes/userRouter");
const authRouter = require("./src/routes/authRouter");
const chatRouter = require("./src/routes/chatRouter");

// Middleware functions
app.use(cors({ origin: FRONTEND_ADDRESS, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);

// Configuration
connectDB();

// Session authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/chat", chatRouter);

// Dev test routers
app.get("/auth-status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  } else {
    return res.json({ authenticated: false });
  }
});

// io connection
let users = [];

const addUser = (user, socketId) => {
  !users.some((existingUser) => existingUser._id === user._id) &&
    users.push({ user, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Socket logic
io.on("connection", (socket) => {
  console.log("A user connected");

  // User status logic
  socket.on("addUser", (user) => {
    addUser(user, socket.id);
    io.emit("getUser", users);
  });

  // Messaging logic
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", (message) => {
    const room = message.room;
    const content = message.content;
    io.to(room).emit("receiveMessage", { content, user: socket.request.user });
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("A user disconnected");
  });
});

// Run server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
