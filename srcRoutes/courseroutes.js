// Example: src/routes/courseRoutes.js

// Only Registrar/Admin can create courses
router.post('/', verifyToken, authorize('Admin', 'Registrar'), courseController.createCourse);

// Students can enroll in a course
router.post('/enroll', verifyToken, authorize('Student'), enrollmentController.enroll);

// Instructors can see their students
router.get('/my-students', verifyToken, authorize('Instructor'), instructorController.viewRoster);