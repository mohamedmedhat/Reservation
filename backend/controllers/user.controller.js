import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const generateAuthToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

// Factory function for creating handlers
const createHandler = (handler) => asyncHandler(handler);

// Handlers
const registerHandler = createHandler(async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

const loginHandler = createHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = generateAuthToken(user);
  res.status(200).json({ token });
});

const createNewUserHandler = createHandler(async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

const getAllUsersHandler = createHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const getUserByIdHandler = createHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

const updateUserHandler = createHandler(async (req, res) => {
  const userId = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(updatedUser);
});

const removeUserHandler = createHandler(async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(deletedUser);
});

export {
  registerHandler as Register,
  loginHandler as LogIn,
  createNewUserHandler as Create,
  getAllUsersHandler as GetAll,
  getUserByIdHandler as GetById,
  updateUserHandler as Update,
  removeUserHandler as Delete,
};
