import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default:false, 
      },
}, { timestamps: true }); 

const User = mongoose.model('User', userSchema); 

export default User;
