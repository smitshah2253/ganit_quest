import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password!: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleId!: string | null;

  @Column({ type: 'int', default: 0 })
  xp!: number;

  @Column({ type: 'int', default: 1 })
  level!: number;

  @Column({ type: 'int', default: 0 })
  stars!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetToken!: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiry!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
