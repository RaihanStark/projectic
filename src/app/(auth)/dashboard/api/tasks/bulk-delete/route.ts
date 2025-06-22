import type { NextRequest } from 'next/server';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();
    const { taskIds } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return createErrorResponse('Task IDs are required');
    }

    // Validate that all tasks belong to the user
    const existingTasks = await db
      .select({ id: tasksSchema.id })
      .from(tasksSchema)
      .where(and(
        inArray(tasksSchema.id, taskIds),
        eq(tasksSchema.userId, userId)
      ));

    if (existingTasks.length !== taskIds.length) {
      return createErrorResponse('Some tasks not found or access denied', 404);
    }

    // Delete the tasks
    await db
      .delete(tasksSchema)
      .where(and(
        inArray(tasksSchema.id, taskIds),
        eq(tasksSchema.userId, userId)
      ));

    return createSuccessResponse({ 
      message: `Successfully deleted ${taskIds.length} tasks`,
      deletedCount: taskIds.length 
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to delete tasks');
  }
}