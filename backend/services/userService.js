const db = require('../config/db');

const getProfile = async (userId) => {
  const user = await db.query(
    'SELECT id, name, email, role, created_at, institution, location, phone FROM users WHERE id = $1',
    [userId]
  );

  if (user.rows.length === 0) {
    throw new Error('User not found');
  }

  return user.rows[0];
};

module.exports = {
  getProfile,
};