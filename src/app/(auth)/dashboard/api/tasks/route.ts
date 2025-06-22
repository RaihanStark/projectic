import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { tasksSchema, subTasksSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    // Fetch tasks with their subtasks
    const tasks = await db
      .select()
      .from(tasksSchema)
      .where(eq(tasksSchema.userId, userId))
      .orderBy(tasksSchema.createdAt);

    // Fetch all subtasks for the user's tasks
    const taskIds = tasks.map(task => task.id);
    
    // Group subtasks by taskId
    const subtasksByTaskId: { [taskId: number]: any[] } = {};
    if (taskIds.length > 0) {
      const allSubtasks = await db.query.subTasksSchema.findMany({
        where: (subtask, { inArray }) => inArray(subtask.taskId, taskIds),
        orderBy: (subtask, { asc }) => [asc(subtask.order)]
      });
      
      allSubtasks.forEach(subtask => {
        const taskId = subtask.taskId;
        if (!subtasksByTaskId[taskId]) {
          subtasksByTaskId[taskId] = [];
        }
        subtasksByTaskId[taskId]!.push(subtask);
      });
    }

    // Combine tasks with their subtasks
    const tasksWithSubtasks = tasks.map(task => ({
      ...task,
      subtasks: subtasksByTaskId[task.id] || []
    }));

    return createSuccessResponse(tasksWithSubtasks);
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

    const { title, description, label, status, urgency, deadline } = body;

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
