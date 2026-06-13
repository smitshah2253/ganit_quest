import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createSubscriptionSchema,
  verifySubscriptionSchema,
} from '../validations/subscriptionSchemas';
import { SubscriptionController } from '../controllers/subscription.controller';

const router = Router();

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
router.get('/status', authenticateToken, SubscriptionController.getStatus);

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
router.post('/create', authenticateToken, validate(createSubscriptionSchema), SubscriptionController.create);

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
router.post('/verify', authenticateToken, validate(verifySubscriptionSchema), SubscriptionController.verify);

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
router.post('/cancel', authenticateToken, SubscriptionController.cancel);

export default router;
