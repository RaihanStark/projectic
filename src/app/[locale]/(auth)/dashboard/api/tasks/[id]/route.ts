import type { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const task = await db
      .select()
      .from(tasksSchema)
      .where(and(eq(tasksSchema.id, Number.parseInt(id)), eq(tasksSchema.userId, userId)))
      .limit(1);

    if (task.length === 0) {
      return createErrorResponse('Task not found', 404);
    }

    return createSuccessResponse(task[0]);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to fetch task');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const body = await request.json();

    const { title, description, label, status, urgency, deadline, isStarred } = body;

    // Check if task exists and belongs to user
    const existingTask = await db
      .select()
      .from(tasksSchema)
      .where(and(eq(tasksSchema.id, Number.parseInt(id)), eq(tasksSchema.userId, userId)))
      .limit(1);

    if (existingTask.length === 0) {
      return createErrorResponse('Task not found', 404);
    }

    const updatedTask = await db
      .update(tasksSchema)
      .set({
        title: title || existingTask[0]?.title || '',
        description: description !== undefined ? description : existingTask[0]?.description,
        label: label !== undefined ? label : existingTask[0]?.label,
        status: status || existingTask[0]?.status || 'todo',
        urgency: urgency || existingTask[0]?.urgency || 'medium',
        deadline: deadline ? new Date(deadline) : existingTask[0]?.deadline,
        isStarred: isStarred !== undefined ? isStarred : existingTask[0]?.isStarred || false,
        updatedAt: new Date(),
      })
      .where(eq(tasksSchema.id, Number.parseInt(id)))
      .returning();

    return createSuccessResponse(updatedTask[0]);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to update task');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    // Check if task exists and belongs to user
    const existingTask = await db
      .select()
      .from(tasksSchema)
      .where(and(eq(tasksSchema.id, Number.parseInt(id)), eq(tasksSchema.userId, userId)))
      .limit(1);

    if (existingTask.length === 0) {
      return createErrorResponse('Task not found', 404);
    }

    await db
      .delete(tasksSchema)
      .where(eq(tasksSchema.id, Number.parseInt(id)));

    return createSuccessResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to delete task');
  }
}
