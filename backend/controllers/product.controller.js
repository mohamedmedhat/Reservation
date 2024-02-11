import multer from 'multer';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import Product from '../models/product.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handles errors with status 500
const handleError = (err, res) => {
  res.status(500).contentType('text/plain').end('Oops! Something went wrong!');
};

// [POST] http://localhost:PORT/products/uploadimg
export const uploadImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file || path.extname(req.file.originalname).toLowerCase() !== '.png') {
      fs.unlink(req.file.path, (err) => {
        if (err) handleError(err, res);
        res.status(403).contentType('text/plain').end('Only .png files are allowed!');
      });
    } else {
      res.status(200).contentType('text/plain').end('File uploaded!');
    }
  } catch (err) {
    handleError(err, res);
  }
});

// [POST] http://localhost:PORT/products/create
export const CreateProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    newProduct.image = req.file ? req.file.path : ''; // If req.file is present, set image path
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [GET] http://localhost:PORT/products/read
export const GetAll = asyncHandler(async (req, res) => {
  try {
    const readProduct = await Product.find();
    res.status(200).json(readProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [GET] http://localhost:PORT/products/readbyid/:id
export const GetById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const readByIdProduct = await Product.findById(id);
    res.status(200).json(readByIdProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [PUT] http://localhost:PORT/products/update/:id
export const Update = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [DELETE] http://localhost:PORT/products/delete/:id
export const Delete = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.status(200).json(deleteProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

export { upload };
