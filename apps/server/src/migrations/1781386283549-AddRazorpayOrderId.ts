import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRazorpayOrderId1781386283549 implements MigrationInterface {
    name = 'AddRazorpayOrderId1781386283549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`subscriptions_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP FOREIGN KEY \`user_progress_ibfk_1\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`google_id\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`user_id\` ON \`subscriptions\``);
        await queryRunner.query(`DROP INDEX \`user_id\` ON \`user_progress\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`google_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`reset_token\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`reset_token_expiry\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`plan_type\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`start_date\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`end_date\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`payment_provider\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`payment_id\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`completed_levels\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`unlocked_levels\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_f382af58ab36057334fb262efd\` (\`googleId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`resetTokenExpiry\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`planType\` varchar(50) NOT NULL DEFAULT 'annual'`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`startDate\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`endDate\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`paymentProvider\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`paymentId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`razorpayOrderId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD UNIQUE INDEX \`IDX_b5d0e1b57bc6c761fb49e79bf8\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`completedLevels\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`unlockedLevels\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`xp\` \`xp\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`level\` \`level\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`stars\` \`stars\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` CHANGE \`status\` \`status\` enum ('active', 'expired', 'cancelled', 'pending') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` CHANGE \`xp\` \`xp\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` CHANGE \`stars\` \`stars\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_progress\` CHANGE \`stars\` \`stars\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` CHANGE \`xp\` \`xp\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` CHANGE \`status\` \`status\` enum ('active', 'expired', 'cancelled', 'pending') NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`stars\` \`stars\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`level\` \`level\` int NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`xp\` \`xp\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`unlockedLevels\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`completedLevels\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP INDEX \`IDX_b5d0e1b57bc6c761fb49e79bf8\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`razorpayOrderId\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`paymentId\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`paymentProvider\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`endDate\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`startDate\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`planType\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetTokenExpiry\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetToken\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_f382af58ab36057334fb262efd\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`googleId\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`unlocked_levels\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`completed_levels\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`payment_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`payment_provider\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`end_date\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`start_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`plan_type\` varchar(50) NULL DEFAULT 'annual'`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`reset_token_expiry\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`reset_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`google_id\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`user_id\` ON \`user_progress\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`user_id\` ON \`subscriptions\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`google_id\` ON \`users\` (\`google_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD CONSTRAINT \`user_progress_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`subscriptions_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
