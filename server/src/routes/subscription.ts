import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Subscription } from '../entities/Subscription';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createSubscriptionSchema,
  verifySubscriptionSchema,
} from '../validations/subscriptionSchemas';

const router = Router();

const subscriptionRepository = () => AppDataSource.getRepository(Subscription);

// Helper to check subscription status
const getSubscriptionStatus = async (userId: number) => {
  const subscription = await subscriptionRepository().findOne({
    where: { userId },
    order: { createdAt: 'DESC' },
  });

  if (!subscription) {
    return { isSubscribed: false, subscription: null };
  }

  const now = new Date();
  const endDate = new Date(subscription.endDate);

  // Auto-expire if past end date
  if (endDate < now && subscription.status === 'active') {
    subscription.status = 'expired';
    await subscriptionRepository().save(subscription);
  }

  const isSubscribed = subscription.status === 'active' && endDate > now;

  return {
    isSubscribed,
    subscription: {
      id: subscription.id,
      status: subscription.status,
      planType: subscription.planType,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      daysRemaining: isSubscribed
        ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    },
  };
};

/**
 * @swagger
 * /subscription/status:
 *   get:
 *     summary: Check user's subscription status
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSubscribed:
 *                   type: boolean
 *                 subscription:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await getSubscriptionStatus(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('GET /subscription/status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /subscription/create:
 *   post:
 *     summary: Create a new subscription (prepares for payment)
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planType
 *             properties:
 *               planType:
 *                 type: string
 *                 enum: [annual, monthly]
 *                 default: annual
 *     responses:
 *       201:
 *         description: Subscription created, awaiting payment
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/create', authenticateToken, validate(createSubscriptionSchema), async (req: AuthRequest, res) => {
  try {
    const { planType = 'annual' } = req.body;

    // Calculate end date (1 year for annual)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Check for existing active subscription
    const existing = await subscriptionRepository().findOne({
      where: {
        userId: req.user.id,
        status: 'active',
      },
    });

    if (existing && new Date(existing.endDate) > new Date()) {
      return res.status(400).json({
        error: 'Active subscription already exists',
        subscription: existing,
      });
    }

    // Create pending subscription (payment to be verified)
    const subscription = subscriptionRepository().create({
      userId: req.user.id,
      status: 'pending',
      planType,
      startDate,
      endDate,
    });

    const saved = await subscriptionRepository().save(subscription);

    // Pricing (INR)
    const pricing: Record<string, { amount: number; currency: string }> = {
      annual: { amount: 499, currency: 'INR' },
      monthly: { amount: 99, currency: 'INR' },
    };

    res.status(201).json({
      message: 'Subscription created, awaiting payment verification',
      subscriptionId: saved.id,
      planType,
      amount: pricing[planType]?.amount || 499,
      currency: 'INR',
    });
  } catch (error) {
    console.error('POST /subscription/create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /subscription/verify:
 *   post:
 *     summary: Verify payment and activate subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionId
 *               - paymentId
 *               - paymentProvider
 *             properties:
 *               subscriptionId:
 *                 type: integer
 *               paymentId:
 *                 type: string
 *               paymentProvider:
 *                 type: string
 *                 enum: [razorpay, stripe]
 *     responses:
 *       200:
 *         description: Subscription activated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/verify', authenticateToken, validate(verifySubscriptionSchema), async (req: AuthRequest, res) => {
  try {
    const { subscriptionId, paymentId, paymentProvider } = req.body;

    const subscription = await subscriptionRepository().findOne({
      where: { id: subscriptionId, userId: req.user.id },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // In production: Verify payment with payment provider
    // For now: Direct activation (add payment verification logic here)

    subscription.status = 'active';
    subscription.paymentId = paymentId;
    subscription.paymentProvider = paymentProvider;
    await subscriptionRepository().save(subscription);

    const result = await getSubscriptionStatus(req.user.id);
    res.json({
      message: 'Subscription activated successfully',
      ...result,
    });
  } catch (error) {
    console.error('POST /subscription/verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /subscription/cancel:
 *   post:
 *     summary: Cancel active subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active subscription found
 *       500:
 *         description: Internal server error
 */
router.post('/cancel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const subscription = await subscriptionRepository().findOne({
      where: {
        userId: req.user.id,
        status: 'active',
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    subscription.status = 'cancelled';
    await subscriptionRepository().save(subscription);

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('POST /subscription/cancel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { getSubscriptionStatus };
export default router;
