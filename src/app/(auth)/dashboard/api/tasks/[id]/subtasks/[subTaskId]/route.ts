import type { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { subTasksSchema, tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

// PUT /api/tasks/[id]/subtasks/[subTaskId] - Update sub-task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subTaskId: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { id, subTaskId } = await params;
    const taskId = Number.parseInt(id);
    const subTaskIdNum = Number.parseInt(subTaskId);
    const body = await request.json();
    const { title, completed } = body;

    if (Number.isNaN(taskId) || Number.isNaN(subTaskIdNum)) {
      return createErrorResponse('Invalid ID');
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

    // Verify sub-task exists and belongs to the task
    const existingSubTask = await db
      .select({ id: subTasksSchema.id })
      .from(subTasksSchema)
      .where(and(
        eq(subTasksSchema.id, subTaskIdNum),
        eq(subTasksSchema.taskId, taskId)
      ))
      .limit(1);

    if (existingSubTask.length === 0) {
      return createErrorResponse('Sub-task not found', 404);
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined && typeof title === 'string') {
      if (title.trim().length === 0) {
        return createErrorResponse('Sub-task title cannot be empty');
      }
      updateData.title = title.trim();
    }
    if (completed !== undefined && typeof completed === 'boolean') {
      updateData.completed = completed;
    }

    if (Object.keys(updateData).length === 0) {
      return createErrorResponse('No valid fields to update');
    }

    // Update sub-task
    const updatedSubTask = await db
      .update(subTasksSchema)
      .set(updateData)
      .where(eq(subTasksSchema.id, subTaskIdNum))
      .returning({
        id: subTasksSchema.id,
        title: subTasksSchema.title,
        completed: subTasksSchema.completed,
        order: subTasksSchema.order,
        createdAt: subTasksSchema.createdAt,
        updatedAt: subTasksSchema.updatedAt,
      });

    return createSuccessResponse({ subTask: updatedSubTask[0] });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to update sub-task');
  }
}

// DELETE /api/tasks/[id]/subtasks/[subTaskId] - Delete sub-task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subTaskId: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { id, subTaskId } = await params;
    const taskId = Number.parseInt(id);
    const subTaskIdNum = Number.parseInt(subTaskId);

    if (Number.isNaN(taskId) || Number.isNaN(subTaskIdNum)) {
      return createErrorResponse('Invalid ID');
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

    // Verify sub-task exists and belongs to the task
    const existingSubTask = await db
      .select({ id: subTasksSchema.id })
      .from(subTasksSchema)
      .where(and(
        eq(subTasksSchema.id, subTaskIdNum),
        eq(subTasksSchema.taskId, taskId)
      ))
      .limit(1);

    if (existingSubTask.length === 0) {
      return createErrorResponse('Sub-task not found', 404);
    }

    // Delete sub-task
    await db
      .delete(subTasksSchema)
      .where(eq(subTasksSchema.id, subTaskIdNum));

    return createSuccessResponse({ message: 'Sub-task deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to delete sub-task');
  }
}