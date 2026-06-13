import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  planType: z.enum(['annual', 'monthly']).default('annual'),
});

export const verifySubscriptionSchema = z.object({
  subscriptionId: z.number().int().positive('Subscription ID must be positive'),
  paymentId: z.string().min(1, 'Payment ID is required'),
  paymentProvider: z.enum(['razorpay', 'stripe']),
  razorpayOrderId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type VerifySubscriptionInput = z.infer<typeof verifySubscriptionSchema>;
