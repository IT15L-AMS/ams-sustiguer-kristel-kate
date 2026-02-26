const { Enrollment, Course, User } = require('../models');

// 1. View Roster (Instructor sees students in their course)
exports.getCourseRoster = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        // Verify the course belongs to this instructor
        const course = await Course.findOne({ where: { id: courseId, instructorId } });
        if (!course) return res.status(403).json({ message: "You are not the instructor for this course" });

        const roster = await Enrollment.findAll({
            where: { courseId },
            include: [{ model: User, attributes: ['id', 'fullName', 'email'] }]
        });

        res.json({ success: true, data: roster });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Submit Grade (Instructor Only)
exports.submitGrade = async (req, res) => {
    try {
        const { enrollmentId, grade, feedback } = req.body;
        const instructorId = req.user.id;

        // Find enrollment and ensure instructor owns the course
        const enrollment = await Enrollment.findByPk(enrollmentId, {
            include: { model: Course }
        });

        if (!enrollment || enrollment.Course.instructorId !== instructorId) {
            return res.status(403).json({ message: "Unauthorized to grade this student" });
        }

        enrollment.grade = grade;
        enrollment.feedback = feedback;
        enrollment.status = 'Completed';
        enrollment.gradedAt = new Date();
        await enrollment.save();

        res.json({ success: true, message: "Grade submitted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. View My Grades (Student Only)
exports.getStudentGrades = async (req, res) => {
    try {
        const studentId = req.user.id;
        const grades = await Enrollment.findAll({
            where: { studentId },
            include: [{ model: Course, attributes: ['title', 'courseCode', 'credits'] }]
        });

        res.json({ success: true, data: grades });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};