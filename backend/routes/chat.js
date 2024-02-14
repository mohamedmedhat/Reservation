import express from 'express';
import { GetMessage, SendMessage } from '../controllers/chat.controller.js';

const router = express.Router();


router.post('/sendMessage',SendMessage);
router.get('/getMessage',GetMessage)

export {
    router as ChatRouter
}