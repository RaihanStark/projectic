import type { NextRequest } from 'next/server';
import { and, eq, count, sum, sql, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { subTasksSchema, tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

// GET /api/subtasks/counts - Get sub-task counts for all user's tasks
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    // First get all user's task IDs to limit the subtask query scope
    const userTasks = await db
      .select({ id: tasksSchema.id })
      .from(tasksSchema)
      .where(eq(tasksSchema.userId, userId));

    if (userTasks.length === 0) {
      return createSuccessResponse({ subTaskCounts: {} });
    }

    const taskIds = userTasks.map(task => task.id);

    // Get sub-task counts with optimized query - no JOIN needed
    const subTaskCounts = await db
      .select({
        taskId: subTasksSchema.taskId,
        total: count(subTasksSchema.id),
        completed: sum(sql`CASE WHEN ${subTasksSchema.completed} = true THEN 1 ELSE 0 END`),
      })
      .from(subTasksSchema)
      .where(inArray(subTasksSchema.taskId, taskIds))
      .groupBy(subTasksSchema.taskId);

    // Convert to object for easy lookup
    const countsMap: { [taskId: number]: { completed: number; total: number } } = {};
    
    for (const row of subTaskCounts) {
      countsMap[row.taskId] = {
        completed: Number(row.completed) || 0,
        total: Number(row.total) || 0,
      };
    }

    return createSuccessResponse({ subTaskCounts: countsMap });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to fetch sub-task counts');
  }
}