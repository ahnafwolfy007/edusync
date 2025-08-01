const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'edusync',
  password: process.env.DB_PASSWORD || 'nintendo11',
  port: process.env.DB_PORT || 5432,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
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
    req.user = user;
    next();
  });
};

// Routes

// Sign Up Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, institution, phone, location } = req.body;
    console.log(req.body);
    // Validation
    if (!name || !email || !password || !institution || !location || !phone) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(req.body); // Debugging line to check incoming data

    // Insert new user - CORRECTED QUERY
    const newUser = await pool.query(
      `INSERT INTO users 
       (name, email, password, institution, phone, location) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, created_at, institution, phone, location`,
      [name, email, hashedPassword, institution, phone, location]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.rows[0].id, 
        email: newUser.rows[0].email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message  // Include the error message for debugging
    });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Check if user exists
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.rows[0].id, 
        email: user.rows[0].email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        createdAt: user.rows[0].created_at,
        institution: user.rows[0].institution,
        location: user.rows[0].location,
        phone: user.rows[0].phone,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Get User Profile Route (Protected)
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, created_at, institution, location, phone FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      user: user.rows[0]
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Verify Token Route
app.post('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    userId: req.user.userId,
    email: req.user.email
  });
});

// Logout Route (Client-side handles token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected successfully', 
      timestamp: result.rows[0].now 
      
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection failed' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});