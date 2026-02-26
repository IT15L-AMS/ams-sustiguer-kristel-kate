const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { verifyToken, authorize } = require('../middleware/auth');

// Instructor Routes
router.get('/roster/:courseId', verifyToken, authorize('Instructor'), gradeController.getCourseRoster);
router.post('/submit', verifyToken, authorize('Instructor'), gradeController.submitGrade);

// Student Routes
router.get('/my-performance', verifyToken, authorize('Student'), gradeController.getStudentGrades);

module.exports = router;