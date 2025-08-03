const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Get all products
router.get('/products', auth, async (req, res) => {
  try {
    const {
      category,
      min_price,
      max_price,
      condition,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone,
        u.location as seller_location,
        COALESCE(pr.avg_rating, 0) as seller_rating,
        COALESCE(pr.total_sales, 0) as seller_total_sales
      FROM products p
      JOIN users u ON p.seller_id = u.user_id
      LEFT JOIN (
        SELECT 
          seller_id,
          AVG(rating) as avg_rating,
          COUNT(*) as total_sales
        FROM product_reviews pr2
        GROUP BY seller_id
      ) pr ON p.seller_id = pr.seller_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Add filters
    if (category && category !== 'all') {
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (min_price) {
      query += ` AND p.price >= $${paramCount}`;
      params.push(parseFloat(min_price));
      paramCount++;
    }

    if (max_price) {
      query += ` AND p.price <= $${paramCount}`;
      params.push(parseFloat(max_price));
      paramCount++;
    }

    if (condition === 'new') {
      query += ` AND p.is_second_hand = false`;
    } else if (condition === 'used') {
      query += ` AND p.is_second_hand = true`;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add sorting
    const validSortFields = ['created_at', 'price', 'name', 'views', 'likes'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortField} ${sortDirection}`;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${paramCount} OFFSET ${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamCount = 1;

    // Apply same filters for count
    if (category && category !== 'all') {
      countQuery += ` AND p.category = ${countParamCount}`;
      countParams.push(category);
      countParamCount++;
    }

    if (min_price) {
      countQuery += ` AND p.price >= ${countParamCount}`;
      countParams.push(parseFloat(min_price));
      countParamCount++;
    }

    if (max_price) {
      countQuery += ` AND p.price <= ${countParamCount}`;
      countParams.push(parseFloat(max_price));
      countParamCount++;
    }

    if (condition === 'new') {
      countQuery += ` AND p.is_second_hand = false`;
    } else if (condition === 'used') {
      countQuery += ` AND p.is_second_hand = true`;
    }

    if (search) {
      countQuery += ` AND (p.name ILIKE ${countParamCount} OR p.description ILIKE ${countParamCount})`;
      countParams.push(`%${search}%`);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Format response
    const products = result.rows.map(product => ({
      id: product.product_id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      category: product.category,
      quantity: product.quantity,
      is_second_hand: product.is_second_hand,
      condition: product.condition || (product.is_second_hand ? 'Used' : 'New'),
      location: product.location || product.seller_location,
      created_at: product.created_at,
      views: product.views || 0,
      likes: product.likes || 0,
      verified: product.verified || false,
      images: product.images ? JSON.parse(product.images) : ['/api/placeholder/400/300'],
      seller: {
        name: product.seller_name,
        email: product.seller_email,
        phone: product.seller_phone,
        rating: parseFloat(product.seller_rating) || 0,
        total_sales: parseInt(product.seller_total_sales) || 0
      }
    }));

    res.json({
      success: true,
      products,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Create new product
router.post('/products', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity = 1,
      is_second_hand = false,
      condition,
      location,
      images = []
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required'
      });
    }

    const query = `
      INSERT INTO products (
        seller_id, name, description, price, category, quantity, 
        is_second_hand, condition, location, images, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING product_id, created_at
    `;

    const values = [
      req.user.user_id,
      name,
      description,
      parseFloat(price),
      category,
      parseInt(quantity),
      is_second_hand,
      condition,
      location,
      JSON.stringify(images)
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product_id: result.rows[0].product_id,
      created_at: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Get all rental properties
router.get('/rentals', auth, async (req, res) => {
  try {
    const {
      min_price,
      max_price,
      bedrooms,
      furnished,
      pet_friendly,
      utilities_included,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let query = `
      SELECT 
        r.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone,
        COALESCE(rr.avg_rating, 0) as owner_rating,
        COALESCE(rr.total_properties, 0) as owner_properties
      FROM rental_items r
      JOIN users u ON r.owner_id = u.user_id
      LEFT JOIN (
        SELECT 
          owner_id,
          AVG(rating) as avg_rating,
          COUNT(*) as total_properties
        FROM rental_reviews rr2
        GROUP BY owner_id
      ) rr ON r.owner_id = rr.owner_id
      WHERE r.is_available = true
    `;

    const params = [];
    let paramCount = 1;

    // Add filters
    if (min_price) {
      query += ` AND r.rental_rate >= ${paramCount}`;
      params.push(parseFloat(min_price));
      paramCount++;
    }

    if (max_price) {
      query += ` AND r.rental_rate <= ${paramCount}`;
      params.push(parseFloat(max_price));
      paramCount++;
    }

    if (bedrooms) {
      query += ` AND r.bedrooms = ${paramCount}`;
      params.push(parseInt(bedrooms));
      paramCount++;
    }

    if (furnished === 'true') {
      query += ` AND r.furnished = true`;
    } else if (furnished === 'false') {
      query += ` AND r.furnished = false`;
    }

    if (pet_friendly === 'true') {
      query += ` AND r.pet_friendly = true`;
    }

    if (utilities_included === 'true') {
      query += ` AND r.utilities_included = true`;
    }

    if (search) {
      query += ` AND (r.name ILIKE ${paramCount} OR r.description ILIKE ${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add sorting
    const validSortFields = ['created_at', 'rental_rate', 'name', 'views', 'likes'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY r.${sortField} ${sortDirection}`;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${paramCount} OFFSET ${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Format response
    const rentals = result.rows.map(rental => ({
      id: rental.rental_id,
      name: rental.name,
      description: rental.description,
      rental_rate: parseFloat(rental.rental_rate),
      rental_type: rental.rental_type,
      bedrooms: rental.bedrooms,
      bathrooms: rental.bathrooms,
      furnished: rental.furnished,
      utilities_included: rental.utilities_included,
      pet_friendly: rental.pet_friendly,
      location: rental.location,
      available_from: rental.available_from,
      views: rental.views || 0,
      likes: rental.likes || 0,
      verified: rental.verified || false,
      floor: rental.floor,
      size: rental.size,
      amenities: rental.amenities ? JSON.parse(rental.amenities) : [],
      images: rental.images ? JSON.parse(rental.images) : ['/api/placeholder/400/300'],
      owner: {
        name: rental.owner_name,
        email: rental.owner_email,
        phone: rental.owner_phone,
        rating: parseFloat(rental.owner_rating) || 0,
        properties: parseInt(rental.owner_properties) || 0
      }
    }));

    res.json({
      success: true,
      rentals
    });

  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rentals',
      error: error.message
    });
  }
});

// Create new rental
router.post('/rentals', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      rental_rate,
      rental_type,
      bedrooms = 1,
      bathrooms = 1,
      furnished = false,
      utilities_included = false,
      pet_friendly = false,
      location,
      available_from,
      amenities = [],
      floor,
      size,
      images = []
    } = req.body;

    // Validation
    if (!name || !description || !rental_rate || !rental_type || !location || !available_from) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, rental rate, rental type, location, and available date are required'
      });
    }

    const query = `
      INSERT INTO rental_items (
        owner_id, name, description, rental_rate, rental_type,
        bedrooms, bathrooms, furnished, utilities_included, pet_friendly,
        location, available_from, amenities, floor, size, images, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true)
      RETURNING rental_id
    `;

    const values = [
      req.user.user_id,
      name,
      description,
      parseFloat(rental_rate),
      rental_type,
      parseInt(bedrooms),
      parseInt(bathrooms),
      furnished,
      utilities_included,
      pet_friendly,
      location,
      available_from,
      JSON.stringify(amenities),
      floor,
      size,
      JSON.stringify(images)
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      rental_id: result.rows[0].rental_id
    });

  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating rental',
      error: error.message
    });
  }
});

// Get all businesses
router.get('/businesses', auth, async (req, res) => {
  try {
    const {
      category,
      min_rating,
      search,
      sort_by = 'rating',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let query = `
      SELECT 
        b.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone,
        COALESCE(br.avg_rating, 0) as rating,
        COALESCE(br.total_reviews, 0) as reviews
      FROM businesses b
      JOIN users u ON b.owner_id = u.user_id
      LEFT JOIN (
        SELECT 
          business_id,
          AVG(rating) as avg_rating,
          COUNT(*) as total_reviews
        FROM business_reviews br2
        GROUP BY business_id
      ) br ON b.business_id = br.business_id
      WHERE b.is_active = true
    `;

    const params = [];
    let paramCount = 1;

    // Add filters
    if (category && category !== 'all') {
      query += ` AND b.category = ${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (min_rating) {
      query += ` AND COALESCE(br.avg_rating, 0) >= ${paramCount}`;
      params.push(parseFloat(min_rating));
      paramCount++;
    }

    if (search) {
      query += ` AND (b.name ILIKE ${paramCount} OR b.description ILIKE ${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add sorting
    const validSortFields = ['rating', 'created_at', 'name'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'rating';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    if (sortField === 'rating') {
      query += ` ORDER BY COALESCE(br.avg_rating, 0) ${sortDirection}`;
    } else {
      query += ` ORDER BY b.${sortField} ${sortDirection}`;
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${paramCount} OFFSET ${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Format response
    const businesses = result.rows.map(business => ({
      id: business.business_id,
      name: business.name,
      description: business.description,
      category: business.category,
      price_range: business.price_range,
      operating_hours: business.operating_hours,
      location: business.location,
      verified: business.verified || false,
      rating: parseFloat(business.rating) || 0,
      reviews: parseInt(business.reviews) || 0,
      services: business.services ? JSON.parse(business.services) : [],
      images: business.images ? JSON.parse(business.images) : ['/api/placeholder/400/300'],
      delivery_time: business.delivery_time,
      student_discount: business.student_discount,
      same_day: business.same_day || false,
      online_available: business.online_available || false,
      min_order: business.min_order,
      warranty: business.warranty,
      group_sessions: business.group_sessions || false,
      eco_friendly: business.eco_friendly || false,
      owner: {
        name: business.owner_name,
        email: business.owner_email,
        phone: business.owner_phone,
        experience: business.experience
      }
    }));

    res.json({
      success: true,
      businesses
    });

  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching businesses',
      error: error.message
    });
  }
});

// Create new business
router.post('/businesses', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price_range,
      operating_hours,
      location,
      phone,
      email,
      services = [],
      delivery_time,
      student_discount,
      same_day = false,
      online_available = false,
      min_order,
      warranty,
      group_sessions = false,
      eco_friendly = false,
      experience,
      images = []
    } = req.body;

    // Validation
    if (!name || !description || !category || !operating_hours || !location || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, operating hours, location, phone, and email are required'
      });
    }

    const query = `
      INSERT INTO businesses (
        owner_id, name, description, category, price_range, operating_hours,
        location, phone, email, services, delivery_time, student_discount,
        same_day, online_available, min_order, warranty, group_sessions,
        eco_friendly, experience, images, is_active, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, true, NOW())
      RETURNING business_id
    `;

    const values = [
      req.user.user_id,
      name,
      description,
      category,
      price_range,
      operating_hours,
      location,
      phone,
      email,
      JSON.stringify(services),
      delivery_time,
      student_discount,
      same_day,
      online_available,
      min_order,
      warranty,
      group_sessions,
      eco_friendly,
      experience,
      JSON.stringify(images)
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      business_id: result.rows[0].business_id
    });

  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating business',
      error: error.message
    });
  }
});

// Get product details
router.get('/products/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone,
        u.location as seller_location,
        COALESCE(pr.avg_rating, 0) as seller_rating,
        COALESCE(pr.total_sales, 0) as seller_total_sales
      FROM products p
      JOIN users u ON p.seller_id = u.user_id
      LEFT JOIN (
        SELECT 
          seller_id,
          AVG(rating) as avg_rating,
          COUNT(*) as total_sales
        FROM product_reviews pr2
        GROUP BY seller_id
      ) pr ON p.seller_id = pr.seller_id
      WHERE p.product_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await pool.query(
      'UPDATE products SET views = COALESCE(views, 0) + 1 WHERE product_id = $1',
      [id]
    );

    const product = result.rows[0];

    res.json({
      success: true,
      product: {
        id: product.product_id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        quantity: product.quantity,
        is_second_hand: product.is_second_hand,
        condition: product.condition || (product.is_second_hand ? 'Used' : 'New'),
        location: product.location || product.seller_location,
        created_at: product.created_at,
        views: (product.views || 0) + 1,
        likes: product.likes || 0,
        verified: product.verified || false,
        images: product.images ? JSON.parse(product.images) : ['/api/placeholder/400/300'],
        seller: {
          name: product.seller_name,
          email: product.seller_email,
          phone: product.seller_phone,
          rating: parseFloat(product.seller_rating) || 0,
          total_sales: parseInt(product.seller_total_sales) || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product details',
      error: error.message
    });
  }
});

// Like/Unlike product
router.post('/products/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Check if user already liked this product
    const existingLike = await pool.query(
      'SELECT * FROM product_likes WHERE product_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM product_likes WHERE product_id = $1 AND user_id = $2',
        [id, userId]
      );
      await pool.query(
        'UPDATE products SET likes = GREATEST(COALESCE(likes, 0) - 1, 0) WHERE product_id = $1',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Product unliked',
        liked: false
      });
    } else {
      // Like
      await pool.query(
        'INSERT INTO product_likes (product_id, user_id) VALUES ($1, $2)',
        [id, userId]
      );
      await pool.query(
        'UPDATE products SET likes = COALESCE(likes, 0) + 1 WHERE product_id = $1',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Product liked',
        liked: true
      });
    }

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

module.exports = router;