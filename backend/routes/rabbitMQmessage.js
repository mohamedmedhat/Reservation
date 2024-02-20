import express from 'express';
import { Consume, Publish } from '../controllers/rabbitMQmessage.controller.js';

const router = express.Router();

router.post('/publish',Publish)
router.post('/consume',Consume)

export default router;
