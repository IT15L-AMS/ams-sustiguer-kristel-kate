const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Enrollment = sequelize.define('Enrollment', {
    status: { 
        type: DataTypes.ENUM('Enrolled', 'Dropped', 'Completed'), 
        defaultValue: 'Enrolled' 
    },
    grade: { 
        type: DataTypes.DECIMAL(3, 2), 
        allowNull: true 
    },
    feedback: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    gradedAt: { 
        type: DataTypes.DATE 
    }
});

module.exports = Enrollment;