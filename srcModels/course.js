const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Course = sequelize.define('Course', {
    title: { type: DataTypes.STRING, allowNull: false },
    courseCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    credits: { type: DataTypes.INTEGER, defaultValue: 3 }
});

module.exports = Course;