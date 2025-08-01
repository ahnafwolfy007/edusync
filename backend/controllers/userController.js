const userService = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.userId);
    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
};