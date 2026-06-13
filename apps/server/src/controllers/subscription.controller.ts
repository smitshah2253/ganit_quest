import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SubscriptionService } from '../services/subscription.service';

export class SubscriptionController {
  static async getStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

      const result = await SubscriptionService.getSubscriptionStatus(req.user.id);
      return res.json(result);
    } catch (error) {
      console.error('GET /subscription/status error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

      const result = await SubscriptionService.createSubscription(req.user.id, req.body.planType);
      
      return res.status(201).json({
        message: 'Subscription created, awaiting payment verification',
        ...result,
      });
    } catch (error: any) {
      if (error.message.includes('Active subscription')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('POST /subscription/create error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async verify(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

      const { subscriptionId, paymentId, paymentProvider } = req.body;
      const result = await SubscriptionService.verifySubscription(req.user.id, subscriptionId, paymentId, paymentProvider);

      return res.json({
        message: 'Subscription activated successfully',
        ...result,
      });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('POST /subscription/verify error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async cancel(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

      await SubscriptionService.cancelSubscription(req.user.id);
      return res.json({ message: 'Subscription cancelled successfully' });
    } catch (error: any) {
      if (error.message.includes('No active')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('POST /subscription/cancel error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
