import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

router.post('/razorpay', WebhookController.razorpay);

export default router;
