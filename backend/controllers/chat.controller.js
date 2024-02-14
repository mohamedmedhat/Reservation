import asyncHandler from 'express-async-handler';
import  Chat  from '../models/message.js';


const createHandler = (handler) => asyncHandler(handler);

const sendMessageHandler = createHandler(async(req,res,next)=>{
    try {
        const { sender, content } = req.body;
        const newMessage = new Chat({ sender, content });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

const getMessageHandler = createHandler(async(req,res,next)=>{
    try {
        const messages = await Chat.find();
        res.status(200).json(messages);
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export {
    sendMessageHandler as SendMessage,
    getMessageHandler as GetMessage
}