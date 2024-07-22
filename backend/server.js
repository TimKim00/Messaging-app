// Libraries
const express = require('express');
const cors = require("cors")
const session = require("express-session");
const passport = require("./src/configs/passport.config");

// Config files
const connectDB = require("./src/configs/db.config");

// Middlewares
const errorHandler = require("./src/middlewares/errorHandler");

// Routers
const indexRouter = require("./src/routes/indexRouter");
const userRouter = require("./src/routes/userRouter");
const authRouter = require("./src/routes/authRouter");
const chatRouter = require("./src/routes/chatRouter");

const app = express();

// Middleware functions
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);

// Configuration
connectDB();

// Session authentication
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, secure: false } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/chat', chatRouter);

// Dev test routers
app.get('/auth-status', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ authenticated: true, user: req.user });
      } else {
        return res.json({ authenticated: false });
      }
})

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});


