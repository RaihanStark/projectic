import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createToken, getUserByEmail, hashPassword, setAuthCookie } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { usersSchema } from '@/models/Schema';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(usersSchema)
      .values({
        email,
        password: hashedPassword,
        name: name || null,
      })
      .returning();

    // Create token
    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || undefined,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}