import express from 'express';
import { DownloadPdf, GeneratePdf } from '../controllers/pdf.controller';

const router = express.Router();


router.get('/generate-pdf',(req,res,next)=>{
  console.log("Received GET request [generate-pdf]");
  next();
},GeneratePdf);

router.get('/download-pdf/:id',(req,res,next)=>{
  console.log("Received GET request [download-pdf]");
  next();
},DownloadPdf)




export default router;