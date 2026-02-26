const { User, Enrollment, Course, Department, sequelize } = require('../models');
const { calculateGPA } = require('calculator');

// 1. Student Transcript (GPA)
exports.getStudentTranscript = async (req, res) => {
    try {
        const studentId = req.user.id;
        const enrollments = await Enrollment.findAll({
            where: { studentId, status: 'Completed' },
            include: [Course]
        });

        const gpa = calculateGPA(enrollments);

        res.json({
            success: true,
            studentId,
            gpa,
            coursesCompleted: enrollments.length,
            details: enrollments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Department Analytics (Admin/Registrar Only)
exports.getDepartmentStats = async (req, res) => {
    try {
        const stats = await Department.findAll({
            attributes: [
                'name',
                [sequelize.fn('COUNT', sequelize.col('Courses.id')), 'totalCourses']
            ],
            include: [{
                model: Course,
                attributes: [],
                include: [{
                    model: Enrollment,
                    attributes: []
                }]
            }],
            group: ['Department.id']
        });

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. System Overview (Admin Only)
exports.getSystemSummary = async (req, res) => {
    try {
        const studentCount = await User.count({ include: { model: Role, where: { name: 'Student' } } });
        const instructorCount = await User.count({ include: { model: Role, where: { name: 'Instructor' } } });
        const courseCount = await Course.count();

        res.json({
            success: true,
            summary: {
                totalStudents: studentCount,
                totalInstructors: instructorCount,
                totalCourses: courseCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};