import type { NextRequest } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { subTasksSchema, tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

// GET /api/tasks/[id]/subtasks - Get all sub-tasks for a task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const taskId = Number.parseInt(id);

    if (Number.isNaN(taskId)) {
      return createErrorResponse('Invalid task ID');
    }

    // Verify task belongs to user
    const task = await db
      .select({ id: tasksSchema.id })
      .from(tasksSchema)
      .where(and(eq(tasksSchema.id, taskId), eq(tasksSchema.userId, userId)))
      .limit(1);

    if (task.length === 0) {
      return createErrorResponse('Task not found', 404);
    }

    // Get sub-tasks ordered by creation order
    const subTasks = await db
      .select({
        id: subTasksSchema.id,
        title: subTasksSchema.title,
        completed: subTasksSchema.completed,
        order: subTasksSchema.order,
        createdAt: subTasksSchema.createdAt,
        updatedAt: subTasksSchema.updatedAt,
      })
      .from(subTasksSchema)
      .where(eq(subTasksSchema.taskId, taskId))
      .orderBy(asc(subTasksSchema.order), asc(subTasksSchema.createdAt));

    return createSuccessResponse({ subTasks });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to fetch sub-tasks');
  }
}

// POST /api/tasks/[id]/subtasks - Create a new sub-task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const taskId = Number.parseInt(id);
    const body = await request.json();
    const { title } = body;

    if (Number.isNaN(taskId)) {
      return createErrorResponse('Invalid task ID');
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return createErrorResponse('Sub-task title is required');
    }

    // Verify task belongs to user
    const task = await db
      .select({ id: tasksSchema.id })
      .from(tasksSchema)
      .where(and(eq(tasksSchema.id, taskId), eq(tasksSchema.userId, userId)))
      .limit(1);

    if (task.length === 0) {
      return createErrorResponse('Task not found', 404);
    }

    // Get the next order number
    const lastSubTask = await db
      .select({ order: subTasksSchema.order })
      .from(subTasksSchema)
      .where(eq(subTasksSchema.taskId, taskId))
      .orderBy(asc(subTasksSchema.order))
      .limit(1);

    const nextOrder = lastSubTask.length > 0 ? (lastSubTask[0]?.order || 0) + 1 : 1;

    // Create sub-task
    const newSubTask = await db
      .insert(subTasksSchema)
      .values({
        taskId,
        title: title.trim(),
        completed: false,
        order: nextOrder,
      })
      .returning({
        id: subTasksSchema.id,
        title: subTasksSchema.title,
        completed: subTasksSchema.completed,
        order: subTasksSchema.order,
        createdAt: subTasksSchema.createdAt,
        updatedAt: subTasksSchema.updatedAt,
      });

    return createSuccessResponse({ subTask: newSubTask[0] });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to create sub-task');
  }
}
