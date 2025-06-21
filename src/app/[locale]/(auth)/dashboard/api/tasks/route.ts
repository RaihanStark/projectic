import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { tasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const tasks = await db
      .select()
      .from(tasksSchema)
      .where(eq(tasksSchema.userId, userId))
      .orderBy(tasksSchema.createdAt);

    return createSuccessResponse(tasks);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to fetch tasks');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();

    const { title, description, label, status, urgency, deadline, isStarred } = body;

    if (!title) {
      return createErrorResponse('Title is required');
    }

    const newTask = await db
      .insert(tasksSchema)
      .values({
        userId,
        title,
        description: description || null,
        label: label || null,
        status: status || 'todo',
        urgency: urgency || 'medium',
        deadline: deadline ? new Date(deadline) : null,
        isStarred: isStarred || false,
      })
      .returning();

    return createSuccessResponse(newTask[0], 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to create task');
  }
}
