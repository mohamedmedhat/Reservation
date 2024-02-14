import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
})

const Chat = mongoose.model("Chat",messageSchema);
export default Chat;