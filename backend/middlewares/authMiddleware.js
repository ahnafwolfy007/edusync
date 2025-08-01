const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = {
      userId: user.userId,
      email: user.email,
      role: user.role
    };
    next();
  });
};

module.exports = {
  authenticateToken,
};