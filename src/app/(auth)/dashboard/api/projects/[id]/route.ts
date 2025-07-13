import type { NextRequest } from 'next/server';
import { and, count, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { projectsSchema, tasksSchema } from '@/models/Schema';
import { getCurrentUserId } from '@/utils/auth';

// Validation schema for updating a project
const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

// GET /api/projects/[id] - Fetch a single project with stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const projectId = Number.parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 },
      );
    }

    // Fetch project with task statistics
    const [project] = await db
      .select({
        id: projectsSchema.id,
        userId: projectsSchema.userId,
        name: projectsSchema.name,
        description: projectsSchema.description,
        color: projectsSchema.color,
        updatedAt: projectsSchema.updatedAt,
        createdAt: projectsSchema.createdAt,
        totalTasks: count(tasksSchema.id),
        completedTasks: count(sql`CASE WHEN ${tasksSchema.status} = 'done' THEN 1 END`),
        overdueTasks: count(sql`CASE WHEN ${tasksSchema.status} != 'done' AND ${tasksSchema.deadline} < NOW() THEN 1 END`),
        dueTodayTasks: count(sql`CASE WHEN ${tasksSchema.status} != 'done' AND DATE(${tasksSchema.deadline}) = CURRENT_DATE THEN 1 END`),
      })
      .from(projectsSchema)
      .leftJoin(tasksSchema, eq(projectsSchema.id, tasksSchema.projectId))
      .where(
        and(
          eq(projectsSchema.id, projectId),
          eq(projectsSchema.userId, userId),
        ),
      )
      .groupBy(projectsSchema.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const projectId = Number.parseInt(id);
    const body = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 },
      );
    }

    // Validate request body
    const validatedData = updateProjectSchema.parse(body);

    // Update the project
    const [updatedProject] = await db
      .update(projectsSchema)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(projectsSchema.id, projectId),
          eq(projectsSchema.userId, userId),
        ),
      )
      .returning();

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;
    const projectId = Number.parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 },
      );
    }

    // First check if the project exists and belongs to the user
    const project = await db.query.projectsSchema.findFirst({
      where: and(
        eq(projectsSchema.id, projectId),
        eq(projectsSchema.userId, userId),
      ),
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    // Delete all tasks associated with the project
    await db
      .delete(tasksSchema)
      .where(eq(tasksSchema.projectId, projectId));

    // Delete the project
    await db
      .delete(projectsSchema)
      .where(eq(projectsSchema.id, projectId));

    return NextResponse.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 },
    );
  }
}
