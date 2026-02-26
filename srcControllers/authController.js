const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, roleName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Assign Role
        const role = await Role.findOne({ where: { name: roleName || 'Student' } });

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            roleId: role.id
        });

        res.status(201).json({ success: true, message: "User created" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email }, include: Role });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.Role.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] }, include: Role });
    res.json({ success: true, data: user });
};