const express = require('express');
const { sequelize, Role } = require('./models');
const authRoutes = require('./routes/authRoutes');
// 1. PLACE IMPORT HERE
const academicRoutes = require('./routes/academicRoutes'); 
const gradeRoutes = require('./routes/gradeRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());

// 2. PLACE MIDDLEWARE HERE
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/academic', academicRoutes); 
app.use('/api/v1/grades', gradeRoutes);
app.use('/api/v1/reports', reportRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(async () => {
    const roles = ['Admin', 'Registrar', 'Instructor', 'Student'];
    for (let r of roles) {
        await Role.findOrCreate({ where: { name: r } });
    }
    app.listen(PORT, () => console.log(`Academic System active on port ${PORT}`));
});