// scripts/reset-admin-password.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // Note: using bcryptjs instead of bcrypt

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = 'admin@easa-flashcards.com'; 
  const newPassword = 'admin123';
  
  try {
    // Hash the password - bcryptjs uses the same API
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    
    console.log(`Password reset successful for user: ${updatedUser.email}`);
    console.log(`New password is: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();