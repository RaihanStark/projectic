import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { waitlistSchema } from '@/models/Schema';

const waitlistSchema_validation = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const result = waitlistSchema_validation.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    
    // Check if email already exists in waitlist
    const existingEmail = await db
      .select()
      .from(waitlistSchema)
      .where(eq(waitlistSchema.email, email))
      .limit(1);
    
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { message: 'You are already on the waitlist!' },
        { status: 200 }
      );
    }
    
    // Add email to waitlist
    await db.insert(waitlistSchema).values({
      email,
    });
    
    return NextResponse.json(
      { message: 'Successfully joined the waitlist!' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get waitlist count (optional - for admin purposes)
    const count = await db
      .select()
      .from(waitlistSchema);
    
    return NextResponse.json({
      count: count.length,
    });
  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json(
      { error: 'Failed to get waitlist count' },
      { status: 500 }
    );
  }
}