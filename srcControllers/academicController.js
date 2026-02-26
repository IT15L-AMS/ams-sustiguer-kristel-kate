const { Course, Enrollment, User, Role } = require('../models');

// Create a Course (Admin/Registrar only)
exports.createCourse = async (req, res) => {
    try {
        const { title, courseCode, credits, departmentId, instructorId } = req.body;
        
        // Validation: Ensure the assigned instructor actually has the 'Instructor' role
        const instructor = await User.findByPk(instructorId, { include: Role });
        if (!instructor || instructor.Role.name !== 'Instructor') {
            return res.status(400).json({ message: "Assigned user is not a valid Instructor" });
        }

        const course = await Course.create({ title, courseCode, credits, departmentId, instructorId });
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Student Enrollment Logic
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id; // From JWT middleware

        // Check if course exists
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Check for duplicate enrollment
        const existing = await Enrollment.findOne({ where: { studentId, courseId } });
        if (existing) return res.status(400).json({ message: "Already enrolled in this course" });

        await Enrollment.create({ studentId, courseId });
        res.status(201).json({ success: true, message: "Enrolled successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};