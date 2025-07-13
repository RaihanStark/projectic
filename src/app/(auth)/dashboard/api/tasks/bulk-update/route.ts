import type { NextRequest } from 'next/server';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();
    const { taskIds, status } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return createErrorResponse('Task IDs are required');
    }

    if (!status || !['todo', 'in-progress', 'done', 'cancelled'].includes(status)) {
      return createErrorResponse('Valid status is required');
    }

    // Validate that all tasks belong to the user
    const existingTasks = await db
      .select({ id: tasksSchema.id, title: tasksSchema.title })
      .from(tasksSchema)
      .where(and(
        inArray(tasksSchema.id, taskIds),
        eq(tasksSchema.userId, userId),
      ));

    if (existingTasks.length !== taskIds.length) {
      return createErrorResponse('Some tasks not found or access denied', 404);
    }

    // Update the tasks
    const updatedTasks = await db
      .update(tasksSchema)
      .set({
        status: status as 'todo' | 'in-progress' | 'done' | 'cancelled',
        updatedAt: new Date(),
      })
      .where(and(
        inArray(tasksSchema.id, taskIds),
        eq(tasksSchema.userId, userId),
      ))
      .returning();

    return createSuccessResponse({
      message: `Successfully updated ${taskIds.length} tasks to ${status}`,
      updatedCount: taskIds.length,
      updatedTasks,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to update tasks');
  }
}
