import { AppDataSource } from '../data-source';
import { Subscription } from '../entities/Subscription';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const subscriptionRepository = () => AppDataSource.getRepository(Subscription);

export class SubscriptionService {
  static async getSubscriptionStatus(userId: number) {
    const subscription = await subscriptionRepository().findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!subscription) {
      return { isSubscribed: false, subscription: null };
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);

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
  }

  static async createSubscription(userId: number, planType: string = 'annual') {
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const existing = await subscriptionRepository().findOne({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existing && new Date(existing.endDate) > new Date()) {
      throw new Error('Active subscription already exists');
    }

    const pricing: Record<string, { amount: number; currency: string }> = {
      annual: { amount: 499, currency: 'INR' },
      monthly: { amount: 99, currency: 'INR' },
    };
    const amount = pricing[planType]?.amount || 499;

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await rzp.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${userId}_${Date.now()}`
    });

    const subscription = subscriptionRepository().create({
      userId,
      status: 'pending',
      planType,
      startDate,
      endDate,
      razorpayOrderId: order.id,
    });

    const saved = await subscriptionRepository().save(subscription);

    return {
      subscriptionId: saved.id,
      razorpayOrderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      planType,
      amount,
      currency: 'INR',
    };
  }

  static async verifySubscription(
    userId: number, 
    subscriptionId: number, 
    paymentId: string, 
    paymentProvider: string,
    razorpayOrderId?: string,
    razorpaySignature?: string
  ) {
    const subscription = await subscriptionRepository().findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (paymentProvider === 'razorpay' && razorpayOrderId && razorpaySignature) {
      const body = razorpayOrderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        throw new Error('Invalid payment signature');
      }
    }

    subscription.status = 'active';
    subscription.paymentId = paymentId;
    subscription.paymentProvider = paymentProvider;
    await subscriptionRepository().save(subscription);

    return this.getSubscriptionStatus(userId);
  }

  static async cancelSubscription(userId: number) {
    const subscription = await subscriptionRepository().findOne({
      where: {
        userId,
        status: 'active',
      },
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    subscription.status = 'cancelled';
    await subscriptionRepository().save(subscription);
    return true;
  }
}
