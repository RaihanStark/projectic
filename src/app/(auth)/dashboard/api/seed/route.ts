import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/utils/auth';
import { seedSampleTasks } from '@/utils/seedData';

export async function POST() {
  try {
    const userId = await getCurrentUserId();
    const seededTasks = await seedSampleTasks(userId);

    return NextResponse.json({
      message: 'Sample tasks seeded successfully',
      taskCount: seededTasks.length,
      userId,
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to seed sample tasks',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
