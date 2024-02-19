import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
    {
      filename: {
        type: String,
        required: true, 
      },
      data:{
        type:Buffer,
        required:true,
      },
    },
    { timestamps: true }
  );

const File = mongoose.model('File',pdfSchema);
export default File;