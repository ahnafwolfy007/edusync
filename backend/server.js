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
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Support both Vite and CRA
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Enhanced error handling for database
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

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

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create announcements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'general',
        priority VARCHAR(20) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create listings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        category VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL, -- 'sell', 'rent', 'buy'
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'sold', 'inactive'
        location VARCHAR(255),
        images TEXT[], -- Array of image URLs
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert sample announcements if table is empty
    const announcementCount = await pool.query('SELECT COUNT(*) FROM announcements');
    if (parseInt(announcementCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO announcements (title, content, type, priority) VALUES
        ('Campus Library Extended Hours', 'Library will be open 24/7 during finals week starting Monday. Take advantage of quiet study spaces and extended computer lab access.', 'academic', 'high'),
        ('New Cafeteria Menu Launch', 'Exciting new food options available starting Monday including vegan and international cuisine options.', 'general', 'medium'),
        ('Career Fair Registration Open', 'Register now for the Spring Career Fair - February 15th. Over 100 companies will be attending including tech giants and local startups.', 'career', 'high'),
        ('Campus WiFi Maintenance', 'Scheduled WiFi maintenance this Sunday 2-6 AM. Temporary service interruptions expected in dorms.', 'general', 'low'),
        ('Winter Break Housing Applications', 'Applications for winter break housing are now open. Submit by December 1st for guaranteed placement.', 'housing', 'medium');
      `);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database on startup
initializeDatabase();

// Routes

// Sign Up Route (Enhanced)
app.post('/api/auth/signup', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { name, email, password } = req.body;

    // Enhanced validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Begin transaction
    await client.query('BEGIN');

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUser = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase(), hashedPassword]
    );

    // Create welcome notification
    await client.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [
        newUser.rows[0].id,
        'Welcome to EduSync!',
        'Welcome to the EduSync community! Start by exploring the marketplace and connecting with fellow students.',
        'welcome'
      ]
    );

    // Commit transaction
    await client.query('COMMIT');

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
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        createdAt: newUser.rows[0].created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  } finally {
    client.release();
  }
});

// Login Route (Enhanced)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Check if user exists
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
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
        createdAt: user.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Get User Profile Route (Enhanced)
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Get user stats
    const listingsCount = await pool.query(
      'SELECT COUNT(*) as total, status FROM listings WHERE user_id = $1 GROUP BY status',
      [req.user.userId]
    );

    const notificationsCount = await pool.query(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [req.user.userId]
    );

    const stats = {
      total_listings: 0,
      active_listings: 0,
      sold_listings: 0,
      unread_notifications: parseInt(notificationsCount.rows[0]?.unread || 0)
    };

    listingsCount.rows.forEach(row => {
      stats.total_listings += parseInt(row.total);
      if (row.status === 'active') stats.active_listings = parseInt(row.total);
      if (row.status === 'sold') stats.sold_listings = parseInt(row.total);
    });

    res.json({
      user: user.rows[0],
      stats
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

// Enhanced Logout Route
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a production app, you might want to blacklist the token
  res.json({ 
    message: 'Logout successful',
    timestamp: new Date().toISOString()
  });
});

// Get Announcements (Dashboard)
app.get('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0, type } = req.query;
    
    let query = 'SELECT * FROM announcements';
    let queryParams = [];
    
    if (type) {
      query += ' WHERE type = $1';
      queryParams.push(type);
    }
    
    query += ' ORDER BY priority DESC, created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const announcements = await pool.query(query, queryParams);

    res.json({
      announcements: announcements.rows,
      total: announcements.rows.length
    });

  } catch (error) {
    console.error('Announcements error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch announcements' 
    });
  }
});

// Get User Listings (Dashboard)
app.get('/api/user/listings', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;
    
    let query = 'SELECT * FROM listings WHERE user_id = $1';
    let queryParams = [req.user.userId];
    
    if (status) {
      query += ' AND status = $2';
      queryParams.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const listings = await pool.query(query, queryParams);

    res.json({
      listings: listings.rows,
      total: listings.rows.length
    });

  } catch (error) {
    console.error('User listings error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user listings' 
    });
  }
});

// Create New Listing
app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, type, location, images = [] } = req.body;

    // Validation
    if (!title || !category || !type) {
      return res.status(400).json({
        message: 'Title, category, and type are required'
      });
    }

    const newListing = await pool.query(
      `INSERT INTO listings (user_id, title, description, price, category, type, location, images) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [req.user.userId, title, description, price, category, type, location, images]
    );

    res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing.rows[0]
    });

  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      message: 'Failed to create listing'
    });
  }
});

// Get Notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0, unread_only = false } = req.query;
    
    let query = 'SELECT * FROM notifications WHERE user_id = $1';
    let queryParams = [req.user.userId];
    
    if (unread_only === 'true') {
      query += ' AND is_read = FALSE';
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const notifications = await pool.query(query, queryParams);

    res.json({
      notifications: notifications.rows,
      total: notifications.rows.length
    });

  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      message: 'Failed to fetch notifications'
    });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }

    res.json({
      message: 'Notification marked as read',
      notification: result.rows[0]
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      message: 'Failed to update notification'
    });
  }
});

// Get Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Get user's listing stats
    const listingStats = await pool.query(`
      SELECT 
        COUNT(*) as total_listings,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_listings,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_listings,
        COALESCE(SUM(views), 0) as total_views,
        COALESCE(SUM(likes), 0) as total_likes
      FROM listings 
      WHERE user_id = $1
    `, [req.user.userId]);

    // Get notification count
    const notificationStats = await pool.query(`
      SELECT COUNT(*) as unread_notifications
      FROM notifications 
      WHERE user_id = $1 AND is_read = FALSE
    `, [req.user.userId]);

    res.json({
      listings: listingStats.rows[0],
      notifications: notificationStats.rows[0]
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard stats'
    });
  }
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as timestamp, version() as db_version');
    res.json({ 
      message: 'Database connected successfully', 
      timestamp: result.rows[0].timestamp,
      version: result.rows[0].db_version
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});