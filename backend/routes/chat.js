import express from "express";
import { GetMessage, SendMessage } from "../controllers/chat.controller.js";
import logger from "../logger.js";

const router = express.Router();

router.post(
  "/sendMessage",
  (req, res, next) => {
    logger.info("message has sent [POST] request");
    next();
  },
  SendMessage
);

router.get(
  "/getMessage",
  (req, res, next) => {
    logger.info("message has recieved [GET] request");
    next();
  },
  GetMessage
);

export { router as ChatRouter };
