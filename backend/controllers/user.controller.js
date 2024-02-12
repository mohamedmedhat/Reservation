import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

const generateAuthToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "night.ofinfidels@gmail.com",
      pass: "123",
    },
  });

  const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");

  const mailOptions = {
    from: "night.ofinfidels@gmail.com",
    to: email,
    subject: `Reset ${email} password`,
    text: `http://localhost:5173/resetPassword/${encodedToken}`,
  };

  await transporter.sendMail(mailOptions);
};

// Factory function for creating handlers
const createHandler = (handler) => asyncHandler(handler);

// [POST] http://localhost:PORT/users/reg
const registerHandler = createHandler(async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

// [POST] http://localhost:PORT/users/login
const loginHandler = createHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = generateAuthToken(user);
  res.status(200).json({ token });
});

// [POST] http://localhost:PORT/users/create
const createNewUserHandler = createHandler(async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

// [GET] http://localhost:PORT/users/getall
const getAllUsersHandler = createHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// [GET] http://localhost:PORT/users/getbyid/:id
const getUserByIdHandler = createHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// [PUT] http://localhost:PORT/users/update/:id
const updateUserHandler = createHandler(async (req, res) => {
  const userId = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(updatedUser);
});

// [DELETE] http://localhost:PORT/users/delete/:id
const removeUserHandler = createHandler(async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(deletedUser);
});

// [POST] http://localhost:PORT/users/resetpassword/:token
const resetPasswordHandler = createHandler(async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.json({ status: true, msg: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});


// [POST] http://localhost:PORT/users/logout
const logoutHandler = createHandler( async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.json({ status: true, msg: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});


export {
  registerHandler as Register,
  loginHandler as LogIn,
  createNewUserHandler as Create,
  getAllUsersHandler as GetAll,
  getUserByIdHandler as GetById,
  updateUserHandler as Update,
  removeUserHandler as Delete,
  resetPasswordHandler as ResetPassword,
  logoutHandler as LogOut
};
