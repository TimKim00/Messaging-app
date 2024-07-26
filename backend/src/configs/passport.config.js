const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const { filterPrivateInfo } = require("../utils");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      // Handle authentication scheme
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    user._doc = filterPrivateInfo(user._doc)
    cb(null, user);
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  });
});

module.exports = passport;
