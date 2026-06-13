import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', unique: true })
  userId!: number;

  @Column({
    type: 'enum',
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending',
  })
  status!: SubscriptionStatus;

  @Column({ type: 'varchar', length: 50, default: 'annual' })
  planType!: string;

  @CreateDateColumn()
  startDate!: Date;

  @Column({ type: 'datetime' })
  endDate!: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentProvider!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper method to check if subscription is active
  isActive(): boolean {
    return this.status === 'active' && new Date() < this.endDate;
  }
}
