import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { UserSeeder } from './UserSeeder';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    // Run seeders
    const userSeeder = new UserSeeder();
    await userSeeder.run(AppDataSource);

    console.log('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
