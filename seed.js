const { sequelize, Role, User, Department, Course } = require('./src/models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Warning: Clears DB
        
        // 1. Create Roles
        const roles = await Role.bulkCreate([
            { name: 'Admin' }, { name: 'Registrar' }, 
            { name: 'Instructor' }, { name: 'Student' }
        ]);

        // 2. Create Users
        const hashedPass = await bcrypt.hash('password123', 10);
        const admin = await User.create({ fullName: 'System Admin', email: 'admin@ams.edu', password: hashedPass, roleId: 1 });
        const instructor = await User.create({ fullName: 'Dr. Smith', email: 'smith@ams.edu', password: hashedPass, roleId: 3 });
        const student = await User.create({ fullName: 'John Doe', email: 'john@student.edu', password: hashedPass, roleId: 4 });

        // 3. Create Department & Course
        const dept = await Department.create({ name: 'Computer Science', code: 'CS' });
        const course = await Course.create({ 
            title: 'Advanced AI', 
            courseCode: 'CS401', 
            credits: 4, 
            departmentId: dept.id, 
            instructorId: instructor.id 
        });

        console.log("✅ Database Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seed();