import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sequelize syntax
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user.id, fullName: user.fullName, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'admin' // Default to admin for now
    });

    // 4. Generate token so they are logged in immediately
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, fullName: user.fullName, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};