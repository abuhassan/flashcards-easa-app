// scripts/create-test-user.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.id);
      
      // Update password if user exists
      const updatedUser = await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { password: hashedPassword }
      });
      
      console.log('Updated test user password:', updatedUser.id);
      return;
    }
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    
    console.log('Created test user:', user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();