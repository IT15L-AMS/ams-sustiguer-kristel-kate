const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { verifyToken, authorize } = require('../middleware/auth');

// Course Management
router.post('/courses', verifyToken, authorize('Admin', 'Registrar'), academicController.createCourse);

// Enrollment
router.post('/enroll', verifyToken, authorize('Student'), academicController.enrollInCourse);

module.exports = router;