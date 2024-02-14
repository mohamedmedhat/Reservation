import express from "express";
import {
  upload,
  Delete,
  GetAll,
  GetById,
  Update,
  CreateProduct,
  uploadImage,
} from "../controllers/product.controller.js";
import { isAuthorized } from "../utilis.js";

const router = express.Router();

router.post("/uploadimg",upload.single('image'),isAuthorized,(req,res,next)=>{
  console.log("Received POST request [uploadimg]");
  next();
},uploadImage)


router.get("/read", (req,res,next)=>{
  console.log("Received GET request [read] from users/read");
  next();
},GetAll);

router.get("/readbyid/:id", isAuthorized,(req,res,next)=>{
  console.log("Received GET request [readbyid] from users/readbyid/:id");
  next();
},GetById);

router.put("/update/:id", isAuthorized,(req,res,next)=>{
  console.log("Received PUT request [update] from users/update/:id");
  next();
},Update);

router.delete("/delete/:id", isAuthorized,(req,res,next)=>{
  console.log("Received DELETE request [delete] from users/delete/:id");
  next();
},Delete);

export default router;
