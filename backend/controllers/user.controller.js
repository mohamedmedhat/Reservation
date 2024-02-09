import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// [post] http://localhost:PORT/users/reg
export const Register = asyncHandler(async (req, res) => {
  try {
    const userData = req.body;
    const usr = new User(userData);

    const salt = bcrypt.genSaltSync(10);
    const cryptedPass = await bcrypt.hashSync(userData.password, salt);

    usr.password = cryptedPass;
    const savedUser = await usr.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// [post] http://localhost:PORT/users/login
export const LogIn = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const usr = await User.findOne({ email: data.email });
    if (!usr) {
      return res.status(404).send("Email or password invalid");
    }

    const validPass = bcrypt.compareSync(data.password, usr.password);

    if (!validPass) {
      return res.status(401).send("Email or password invalid");
    }

    const payload = {
      _id: usr._id,
      email: usr.email,
      name: usr.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    res.status(200).send({ mytoken: token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// [post] http://localhost:PORT/users/create
export const Create = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const usr = new User(data);
    const saveUser = await usr.save();
    res.send(saveUser);
  } catch (err) {
    res.send(err);
  }
});

// [GET] http://localhost:PORT/users/getall
export const GetAll = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

// [GET] http://localhost:PORT/users/getbyid/:id
export const GetById = asyncHandler(async (req, res) => {
  try {
    const myid = req.params.id;
    const users = await User.findOne({ _id: myid });
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

// [PUT] http://localhost:PORT/users/update/:id
export const Update = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updateUser = await User.findOneAndUpdate({ _id: id }, newData);
    res.send(updateUser);
  } catch (err) {
    res.send(err);
  }
});

// [DELETE] http://localhost:PORT/users/delete/:id
export const Delete = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUser = await User.findOneAndDelete({ _id: id });
    res.status(200).send(deleteUser);
  } catch (err) {
    res.status(404).send(err);
  }
});
