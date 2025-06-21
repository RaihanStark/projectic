import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { tasksSchema } from '@/models/Schema';
import { getCurrentUserId } from '@/utils/auth';

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    // Test database connection by counting tasks
    const taskCount = await db
      .select({ count: tasksSchema.id })
      .from(tasksSchema)
      .where(eq(tasksSchema.userId, userId));

    return NextResponse.json({
      status: 'healthy',
      userId,
      taskCount: taskCount.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
