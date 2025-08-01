const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({
      message: 'User created successfully',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
};

const verifyToken = (req, res) => {
  res.json({
    valid: true,
    userId: req.user.userId,
    email: req.user.email,
    role: req.user.role
  });
};

const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

module.exports = {
  signup,
  login,
  verifyToken,
  logout,
};