const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify', authenticateToken, authController.verifyToken);
router.post('/logout', authController.logout);

module.exports = router;