import express from "express";

import {
  Register,
  LogIn,
  Create,
  GetAll,
  GetById,
  Update,
  Delete,
  ResetPassword,
  LogOut,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/reg", (req,res,next)=>{
  console.log("Received POST request to /users/reg");
  next();
},Register);

router.post("/login", (req,res,next)=>{
  console.log("Received POST request [login] from users/login");
  next();
},LogIn);

router.post("/create",  (req,res,next)=>{
  console.log("Received POST request [create] from users/create");
  next();
},Create);

router.get("/getall",  (req,res,next)=>{
  console.log("Received GET request [getall] from users/getall");
  next();
},GetAll);

router.get("/getbyid/:id",  (req,res,next)=>{
  console.log("Received GET request [getbyid] from users/getbyid/:id");
  next();
},GetById);

router.put("/update/:id",  (req,res,next)=>{
  console.log("Received PUT request [update] from users/update/:id");
  next();
},Update);

router.delete("/delete/:id",  (req,res,next)=>{
  console.log("Received DELETE request [delete] from users/delete/:id");
  next();
},Delete);

router.post('/resetpassword/:token',(req,res,next)=>{
  console.log("Received POST request [resetPassword] from users/resetpassword/:toekn");
  next();
},ResetPassword);

router.post('/logout',(req,res,next)=>{
  console.log("Received POST request [logout] from users/logout");
  next();
},LogOut)

export default router;
