'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../../../lib/prisma';

const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserData = z.infer<typeof UserSchema>;

export async function createUser(data: UserData) {
  try {
    // Validate user data
    const validatedData = UserSchema.safeParse(data);
    
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }
    
    const { name, email, password } = validatedData.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return { error: 'A user with this email already exists' };
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'An unexpected error occurred' };
  }
}