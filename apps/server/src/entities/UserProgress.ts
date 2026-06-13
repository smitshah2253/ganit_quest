import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', unique: true })
  userId!: number;

  @Column({ type: 'int', default: 0 })
  xp!: number;

  @Column({ type: 'int', default: 0 })
  stars!: number;

  @Column({ type: 'simple-json', nullable: true })
  completedLevels!: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  unlockedLevels!: string[] | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
