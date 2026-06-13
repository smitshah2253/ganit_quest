import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if test user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('Test user already exists, skipping...');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = userRepository.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      xp: 0,
      level: 1,
      stars: 0,
    });

    await userRepository.save(testUser);
    console.log('Test user created successfully');
  }
}
