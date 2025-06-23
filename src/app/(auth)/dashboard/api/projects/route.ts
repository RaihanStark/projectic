import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { projectsSchema, tasksSchema } from '@/models/Schema';
import { getCurrentUserId } from '@/utils/auth';
import { eq, and, isNull, count, sql } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for creating a project
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional().default('#3b82f6'),
});

// GET /api/projects - Fetch all projects for the authenticated user
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    // Fetch projects with task statistics
    const projects = await db
      .select({
        id: projectsSchema.id,
        userId: projectsSchema.userId,
        name: projectsSchema.name,
        description: projectsSchema.description,
        color: projectsSchema.color,
        isArchived: projectsSchema.isArchived,
        updatedAt: projectsSchema.updatedAt,
        createdAt: projectsSchema.createdAt,
        totalTasks: count(tasksSchema.id),
        completedTasks: count(sql`CASE WHEN ${tasksSchema.status} = 'done' THEN 1 END`),
        overdueTasks: count(sql`CASE WHEN ${tasksSchema.status} != 'done' AND ${tasksSchema.deadline} < NOW() THEN 1 END`),
        dueTodayTasks: count(sql`CASE WHEN ${tasksSchema.status} != 'done' AND DATE(${tasksSchema.deadline}) = CURRENT_DATE THEN 1 END`),
      })
      .from(projectsSchema)
      .leftJoin(tasksSchema, eq(projectsSchema.id, tasksSchema.projectId))
      .where(eq(projectsSchema.userId, userId))
      .groupBy(projectsSchema.id)
      .orderBy(projectsSchema.createdAt);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();

    // Validate request body
    const validatedData = createProjectSchema.parse(body);

    // Create the project
    const [newProject] = await db
      .insert(projectsSchema)
      .values({
        userId,
        name: validatedData.name,
        description: validatedData.description || null,
        color: validatedData.color,
      })
      .returning();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}