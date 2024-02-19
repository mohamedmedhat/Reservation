import asyncHandler from 'express-async-handler';
import pdfDoc from 'pdfkit';
import File from '../models/pdf.js';


const createHandler = (handler) => asyncHandler(handler);

// [GET] http://localhost:PORT/pdfs/generate-pdf
const generatePdfHandler = createHandler(async (req,res)=>{
    try{
        const doc = new pdfDoc();
        doc.fontSize(20).text('hello this is pdf using pdfkit in nodejs');

        const buffer = await new Promise((resolve,reject)=>{
            const chunks = [];
            doc.on('data',(chunk)=>chunks.push(chunk));
            doc.on('end',()=>resolve(Buffer.concat(chunks)));
            doc.end();
        });

        const file = new File({
            filename: 'example.pdf',
            data: buffer
        });
        await file.save();
        res.send('Pdf generated and stored in db');
    }
    catch(error){
        console.log(error);
        res.status(500).sned('interval server error');
    }
})


// [GEt] http://localhost:PORT/pdfs/download-pdf/:id
const downloadPdfHanlder = createHandler(async(req,res)=>{
    try{
        const file = await File.findById(req.params.id);
        if(!file){
            return res.status(404).send("File not found");
        }
        res.setHeader('Content-Disposition','attachment; filename= '+file.filename);
        res.setHeader('COntent-Type','application/pdf');
        res.send(file.data);
    }
    catch(error){
        console.log(error);
        res.statux(500).send("Interval Server error")
    }
})


export {
    generatePdfHandler as GeneratePdf,
    downloadPdfHanlder as DownloadPdf,
}