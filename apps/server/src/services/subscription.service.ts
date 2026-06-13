import { AppDataSource } from '../data-source';
import { Subscription } from '../entities/Subscription';

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
    endDate.setFullYear(endDate.getFullYear() + 1); // TODO: handle monthly

    const existing = await subscriptionRepository().findOne({
      where: {
        userId,
        status: 'active',
      },
    });

    if (existing && new Date(existing.endDate) > new Date()) {
      throw new Error('Active subscription already exists');
    }

    const subscription = subscriptionRepository().create({
      userId,
      status: 'pending',
      planType,
      startDate,
      endDate,
    });

    const saved = await subscriptionRepository().save(subscription);

    const pricing: Record<string, { amount: number; currency: string }> = {
      annual: { amount: 499, currency: 'INR' },
      monthly: { amount: 99, currency: 'INR' },
    };

    return {
      subscriptionId: saved.id,
      planType,
      amount: pricing[planType]?.amount || 499,
      currency: 'INR',
    };
  }

  static async verifySubscription(userId: number, subscriptionId: number, paymentId: string, paymentProvider: string) {
    const subscription = await subscriptionRepository().findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
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
