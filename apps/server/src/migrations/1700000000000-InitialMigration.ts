import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NULL,
        googleId VARCHAR(255) UNIQUE NULL,
        xp INT DEFAULT 0,
        level INT DEFAULT 1,
        stars INT DEFAULT 0,
        resetToken VARCHAR(255) NULL,
        resetTokenExpiry DATETIME NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_progress table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        xp INT DEFAULT 0,
        stars INT DEFAULT 0,
        completedLevels JSON NULL,
        unlockedLevels JSON NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create subscriptions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
        planType VARCHAR(50) DEFAULT 'annual',
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP NOT NULL,
        paymentProvider VARCHAR(50) NULL,
        paymentId VARCHAR(255) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS subscriptions`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_progress`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
