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
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/reg",
  [
    body("name").notEmpty(),
    body("lastname").notEmpty(),
    body("phoneNumber").isNumeric(),
    body("age").isNumeric(),
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password").isLength({ min: 5 }).withMessage("need more characters"),
    body("isAdmin").isBoolean(),
  ],
  (req, res, next) => {
    logger.info("Received POST request to /users/reg");
    next();
  },
  Register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password").isLength({ min: 5 }).withMessage("need more characters"),
  ],
  (req, res, next) => {
    logger.info("Received POST request [login] from users/login");
    next();
  },
  LogIn
);

router.post(
  "/create",
  [
    body("name").notEmpty(),
    body("lastname").notEmpty(),
    body("phoneNumber").isNumeric(),
    body("age").isNumeric(),
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password").isLength({ min: 5 }).withMessage("need more characters"),
    body("isAdmin").isBoolean(),
  ],
  (req, res, next) => {
    logger.info("Received POST request [create] from users/create");
    next();
  },
  Create
);

router.get(
  "/getall",
  (req, res, next) => {
    logger.info("Received GET request [getall] from users/getall");
    next();
  },
  GetAll
);

router.get(
  "/getbyid/:id",
  (req, res, next) => {
    logger.info("Received GET request [getbyid] from users/getbyid/:id");
    next();
  },
  GetById
);

router.put(
  "/update/:id",
  (req, res, next) => {
    logger.info("Received PUT request [update] from users/update/:id");
    next();
  },
  Update
);

router.delete(
  "/delete/:id",
  isAuthorized,
  (req, res, next) => {
    logger.info("Received DELETE request [delete] from users/delete/:id");
    next();
  },
  Delete
);

router.post(
  "/forgotpassword",
  [body("email").notEmpty().isEmail()],
  (req, res, next) => {
    logger.info(
      "Received POST request [forgotpassword] from users/forgotpassword"
    );
    next();
  },
  ForgotPassword
);

router.post(
  "/forgotpasswordassms",
  [
    body("password").isLength({ min: 5 }).withMessage("need more characters"),
    body("email").isEmail().notEmpty(),
  ],
  (req, res, next) => {
    logger.info(
      "Received POST request [forgotpasswordassms] from users/forgotpasswordassms"
    );
    next();
  },
  SmsSender
);

router.post(
  "/resetpassword/:token",
  [body("password").isLength({ min: 5 }).withMessage("need more characters")],
  (req, res, next) => {
    logger.info(
      "Received POST request [resetPassword] from users/resetpassword/:token"
    );
    next();
  },
  ResetPassword
);

router.post(
  "/payment",
  (req, res, next) => {
    logger.info("Received POST request [payment] from users/payment");
    next();
  },
  Payment
);

router.post(
  "/logout",
  (req, res, next) => {
    logger.info("Received POST request [logout] from users/logout");
    next();
  },
  LogOut
);

export default router;
