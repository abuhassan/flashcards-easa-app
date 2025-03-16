import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = 'admin@easa-flashcards.com';
  const newPassword = 'admin123';

  try {
    console.log("🔍 Checking if user exists...");

    // Fetch the existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.error(`❌ User with email ${email} not found.`);
      return;
    }

    if (!existingUser.password) {
      console.log(`⚠️ Password is NULL for user ${email}. Generating a new password...`);
    } else {
      console.log(`🔹 Existing hashed password: ${existingUser.password}`);

      // Compare existing hashed password with new password
      const isSamePassword = await bcrypt.compare(newPassword, existingUser.password);

      if (isSamePassword) {
        console.log("✅ Password is already set to the same value. No update needed.");
        return;
      }
    }

    console.log("🔄 Hashing and updating new password...");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log(`✅ Password reset successful for user: ${updatedUser.email}`);
    console.log(`🔹 New password: ${newPassword}`);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
