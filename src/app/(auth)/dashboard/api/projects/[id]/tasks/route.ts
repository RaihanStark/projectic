import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { tasksSchema, subTasksSchema } from '@/models/Schema';
import { getCurrentUserId } from '@/utils/auth';
import { eq, and } from 'drizzle-orm';

// GET /api/projects/[id]/tasks - Fetch all tasks for a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Fetch tasks with subtasks for the project
    const tasks = await db
      .select({
        id: tasksSchema.id,
        userId: tasksSchema.userId,
        projectId: tasksSchema.projectId,
        title: tasksSchema.title,
        description: tasksSchema.description,
        label: tasksSchema.label,
        status: tasksSchema.status,
        urgency: tasksSchema.urgency,
        deadline: tasksSchema.deadline,
        updatedAt: tasksSchema.updatedAt,
        createdAt: tasksSchema.createdAt,
        subtasks: subTasksSchema,
      })
      .from(tasksSchema)
      .leftJoin(subTasksSchema, eq(tasksSchema.id, subTasksSchema.taskId))
      .where(
        and(
          eq(tasksSchema.userId, userId),
          eq(tasksSchema.projectId, projectId)
        )
      )
      .orderBy(tasksSchema.createdAt);

    // Group subtasks with their tasks
    const tasksMap = new Map();
    tasks.forEach(row => {
      const taskId = row.id;
      if (!tasksMap.has(taskId)) {
        tasksMap.set(taskId, {
          id: row.id,
          userId: row.userId,
          projectId: row.projectId,
          title: row.title,
          description: row.description,
          label: row.label,
          status: row.status,
          urgency: row.urgency,
          deadline: row.deadline,
          updatedAt: row.updatedAt,
          createdAt: row.createdAt,
          subtasks: [],
        });
      }
      if (row.subtasks?.id) {
        tasksMap.get(taskId).subtasks.push({
          id: row.subtasks.id,
          taskId: row.subtasks.taskId,
          title: row.subtasks.title,
          completed: row.subtasks.completed,
          order: row.subtasks.order,
          updatedAt: row.subtasks.updatedAt,
          createdAt: row.subtasks.createdAt,
        });
      }
    });

    const tasksWithSubtasks = Array.from(tasksMap.values());
    return NextResponse.json(tasksWithSubtasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project tasks' },
      { status: 500 }
    );
  }
}