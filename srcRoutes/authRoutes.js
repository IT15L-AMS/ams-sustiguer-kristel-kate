const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);

// Example Restricted Route
router.get('/admin-only', verifyToken, authorize('Admin'), (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

module.exports = router;