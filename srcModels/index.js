const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
});

const User = require('User');
const Role = require('Role');
const Department = require('Department');
const Course = require('Course');
const Enrollment = require('Enrollment');

// Associations
Department.hasMany(Course, { foreignKey: 'departmentId' });
Course.belongsTo(Department, { foreignKey: 'departmentId' });

User.hasMany(Course, { foreignKey: 'instructorId', as: 'TaughtCourses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'Instructor' });

// Many-to-Many: Students and Courses through Enrollment
User.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentId' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });

module.exports = { sequelize, User, Role, Department, Course, Enrollment };