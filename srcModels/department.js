const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Department = sequelize.define('Department', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { timestamps: false });

module.exports = Department;