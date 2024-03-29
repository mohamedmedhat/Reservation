import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import stripe from 'stripe';
import User from '../models/user.js';
import redisClient from '../redisConfig.js';
import { validationResult } from 'express-validator';

const generateAuthToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
    isAdmin:user.isAdmin,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
};

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Reset ${email} password`,
    text: `http://localhost:5173/resetPassword/${encodedToken}`,
  };

  await transporter.sendMail(mailOptions);
};

const ValidateErrors = async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
}

// Factory function for creating handlers

// const createHandler = (handler) => async (req, res) => {
//   const cacheKey = req.originalUrl;

//   // Check if data exists in Redis cache
//   redisClient.get(cacheKey, (err, cachedData) => {
//     if (err) {
//       console.error('Redis Error:', err);
//       // If error, proceed without cache
//       return handler(req, res);
//     } else if (cachedData) {
//       // If data exists in cache, return cached data
//       return res.json(JSON.parse(cachedData));
//     } else {
//       // If data does not exist in cache, fetch from database
//       handler(req, res)
//         .then((data) => {
//           // Cache data in Redis
//           redisClient.setex(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
//           res.json(data);
//         })
//         .catch((error) => {
//           console.error('Error fetching data from database:', error);
//           res.status(500).json({ error: 'Internal server error' });
//         });
//     }
//   });
// };

const createHandler = (handler) => asyncHandler(handler)

// [POST] http://localhost:PORT/users/reg
const registerHandler = createHandler(async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  ValidateErrors(req,res);
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

// [POST] http://localhost:PORT/users/login
const loginHandler = createHandler(async (req, res) => {
  ValidateErrors(req,res);
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
  ValidateErrors(req,res);
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
  ValidateErrors(req,res);
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

//[POST] http://localhost:PORT/users/forgotpassword
const forgotPasswordHandler = createHandler(async (req, res, next) => {
  try {
    ValidateErrors(req,res);
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: "User not found" });
    }

    const token = generateAuthToken({ id: user._id }); // Corrected from generateToken to generateAuthToken
    await sendResetPasswordEmail(email, token);

    return res.json({ status: true, msg: "Reset password email sent" });
  } catch (error) {
    next(error);
  }
})

// [POST] http://localhost:PORT/users/forgotpasswordassms
const smsSenderHandler = createHandler(async (req, res, next) => {
  ValidateErrors(req,res);
  const { phoneNumber, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.phoneNumber !== phoneNumber) {
    return res.status(400).json({ message: 'Provided phone number does not match the user record' });
  }

  try {
    // Generate random password
    const newPassword = Math.random().toString(36).substring(2, 10);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Send the new password as an SMS using Twilio
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: `Your new password: ${newPassword}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return res.json({ status: true, message: 'Password sent via SMS' });
  } catch (error) {
    next(error);
  }
});

// [POST] http://localhost:PORT/users/resetpassword/:token
const resetPasswordHandler = createHandler(async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword }); // Changed UserModel to User

    return res.json({ status: true, message: "Password updated successfully" }); // Changed msg to message
  } catch (error) {
    next(error);
  }
});

//[POST] http://localhost:PORT/users/payment
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey);
const paymentHandler = createHandler(async (req,res)=>{
  try{
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      payment_method_types: req.body.payment_method_types,
    });
    res.json({ client_secret: paymentIntent.client_secret });
  }
  catch(error){
    console.error('Error:', error);
    res.status(500).send({ error: 'An error occurred while processing the payment' });
  }
})

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
  forgotPasswordHandler as ForgotPassword,
  smsSenderHandler as SmsSender,
  resetPasswordHandler as ResetPassword,
  paymentHandler as Payment,
  logoutHandler as LogOut,
};
