import express from "express";
import { DownloadPdf, GeneratePdf } from "../controllers/pdf.controller.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get(
  "/generate-pdf",
  (req, res, next) => {
    logger.info("Received GET request [generate-pdf]");
    next();
  },
  GeneratePdf
);

router.get(
  "/download-pdf/:id",
  (req, res, next) => {
    logger.info("Received GET request [download-pdf]");
    next();
  },
  DownloadPdf
);

export default router;
