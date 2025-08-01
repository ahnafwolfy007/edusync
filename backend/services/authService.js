const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../config/auth');

const signup = async (userData) => {
  const { name, email, password, institution, phone, location, role } = userData;

  // Validate role against enum values
  const validRoles = ['student', 'faculty', 'business_owner', 'admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role specified');
  }

  // Check if user exists
  const existingUser = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert new user with role
  const newUser = await db.query(
    `INSERT INTO users 
     (name, email, password, institution, phone, location, role) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING user_id, name, email, created_at, institution, phone, location, role`,
    [name, email, hashedPassword, institution, phone, location, role]
  );

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: newUser.rows[0].id, 
      email: newUser.rows[0].email,
      role: newUser.rows[0].role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: newUser.rows[0],
    token,
  };
};

const login = async (email, password) => {
  // Check if user exists
  const user = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (user.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token with role
  const token = jwt.sign(
    { 
      userId: user.rows[0].id, 
      email: user.rows[0].email,
      role: user.rows[0].role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role,
      createdAt: user.rows[0].created_at,
      institution: user.rows[0].institution,
      location: user.rows[0].location,
      phone: user.rows[0].phone,
    },
    token,
  };
};

module.exports = {
  signup,
  login,
};