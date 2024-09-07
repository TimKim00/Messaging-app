// const validateSession = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(401).json({ message: "Authentication invalid" });
// };
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const validateSession = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach the decoded user info to the request object
    next();
  });
};

module.exports = validateSession;
