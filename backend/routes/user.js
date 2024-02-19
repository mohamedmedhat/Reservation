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
  ForgotPassword,
  SmsSender,
  Payment,
} from "../controllers/user.controller.js";
import { isAuthorized } from "../utils/utilis.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastname
 *         - phoneNumber
 *         - age
 *         - email
 *         - password
 *         - isAuth
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         lastname:
 *           type: string
 *           description: User's last name
 *         phoneNumber:
 *           type: number
 *           description: User's phone number
 *         age:
 *           type: number
 *           description: User's age
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *         isAuth:
 *           type: boolean
 *           description: Indicates whether the user is authenticated or not
 */




/**
 * @swagger
 * /users/reg:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request, missing or invalid data
 *       ''500'':
 *         description: Internal server error
 */
router.post("/reg", (req,res,next)=>{
  logger.info("Received POST request to /users/reg");
  next();
},Register);


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in user
 *     description: Log in with the provided email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Unauthorized, invalid email or password
 *       '500':
 *         description: Internal server error
 */
router.post("/login", (req,res,next)=>{
  logger.info("Received POST request [login] from users/login");
  next();
},LogIn);


/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request, missing or invalid data
 *       '500':
 *         description: Internal server error
 */
router.post("/create",(req,res,next)=>{
  logger.info("Received POST request [create] from users/create");
  next();
},Create);


/**
 * @swagger
 * /users/getall:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully
 *       '500':
 *         description: Internal server error
 */
router.get("/getall",(req,res,next)=>{
  logger.info("Received GET request [getall] from users/getall");
  next();
},GetAll);


/**
 * @swagger
 * /users/getbyid/:id:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by providing user ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       '200':
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get("/getbyid/:id",(req,res,next)=>{
  logger.info("Received GET request [getbyid] from users/getbyid/:id");
  next();
},GetById);


/**
 * @swagger
 * /users/update/:id:
 *   put:
 *     summary: Update user details
 *     description: Update user details by providing user ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User details updated successfully
 *       404:
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.put("/update/:id",(req,res,next)=>{
  logger.info("Received PUT request [update] from users/update/:id");
  next();
},Update);


/**
 * @swagger
 * /users/delete/:id:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by providing user ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       404:
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/delete/:id",  isAuthorized,(req,res,next)=>{
  logger.info("Received DELETE request [delete] from users/delete/:id");
  next();
},Delete);


/**
 * @swagger
 * /users/forgotpassword:
 *   post:
 *     summary: Request password reset
 *     description: Send an email with instructions to reset password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset email sent successfully
 *       404:
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post('/forgotpassword', (req,res,next)=>{
  logger.info("Received POST request [forgotpassword] from users/forgotpassword");
  next();
},ForgotPassword);


/**
 * @swagger
 * /users/forgotpasswordassms:
 *   post:
 *     summary: Request password reset via SMS
 *     description: Send a new password to the user's phone number via SMS
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New password sent via SMS successfully
 *       400:
 *         description: Provided phone number does not match the user record
 *       404:
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post('/forgotpasswordassms',(req,res,next)=>{
  logger.info("Received POST request [forgotpasswordassms] from users/forgotpasswordassms");
  next();
},SmsSender)


/**
 * @swagger
 * /users/resetpassword/:token:
 *   post:
 *     summary: Reset password
 *     description: Reset user password using the provided token
 *     tags: [Users]
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Reset password token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or missing password
 *       '500':
 *         description: Internal server error
 */
router.post('/resetpassword/:token',(req,res,next)=>{
  logger.info("Received POST request [resetPassword] from users/resetpassword/:token");
  next();
},ResetPassword);


/**
 * @swagger
 * /users/payment:
 *   post:
 *     summary: Process payment
 *     description: Process payment using Stripe API
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               payment_method_types:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Payment processed successfully
 *       '500':
 *         description: Internal server error
 */
router.post('/payment',(req,res,next)=>{
  logger.info("Received POST request [payment] from users/payment");
  next();
},Payment)


/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out user
 *     description: Log out the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '401':
 *         description: Unauthorized, user not authorized to perform this action
 *       '500':
 *         description: Internal server error
 */
router.post('/logout',(req,res,next)=>{
  logger.info("Received POST request [logout] from users/logout");
  next();
},LogOut)

export default router;
