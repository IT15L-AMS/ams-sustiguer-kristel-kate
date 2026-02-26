const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorize } = require('../middleware/auth');

// Student: View personal transcript/GPA
router.get('/transcript', verifyToken, authorize('Student'), reportController.getStudentTranscript);

// Registrar/Admin: View department performance
router.get('/departments', verifyToken, authorize('Admin', 'Registrar'), reportController.getDepartmentStats);

// Admin: Overall system health
router.get('/system-summary', verifyToken, authorize('Admin'), reportController.getSystemSummary);

module.exports = router;