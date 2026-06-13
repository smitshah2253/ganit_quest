import { Request, Response } from 'express';
import crypto from 'crypto';
import { AppDataSource } from '../data-source';
import { Subscription } from '../entities/Subscription';

export class WebhookController {
  static async razorpay(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const secret = process.env.RAZORPAY_KEY_SECRET;

      if (!secret || !signature) {
        return res.status(400).send('Missing signature or secret');
      }

      // To verify signature with express.json(), we need raw body. But assuming simple verification for now.
      // A better way is to use express.raw({ type: 'application/json' }) for this route.
      // Assuming req.body is already an object, JSON.stringify(req.body) might not strictly match the raw string, 
      // but if we configure express properly we can get req.rawBody
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).send('Invalid signature');
      }

      const event = req.body.event;
      if (event === 'payment.captured') {
        const payment = req.body.payload.payment.entity;
        const orderId = payment.order_id;
        
        if (orderId) {
          const subscriptionRepository = AppDataSource.getRepository(Subscription);
          const subscription = await subscriptionRepository.findOne({
            where: { razorpayOrderId: orderId }
          });

          if (subscription && subscription.status !== 'active') {
            subscription.status = 'active';
            subscription.paymentId = payment.id;
            subscription.paymentProvider = 'razorpay';
            await subscriptionRepository.save(subscription);
          }
        }
      }

      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Webhook error');
    }
  }
}
