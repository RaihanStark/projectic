import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { documentsSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const documents = await db
      .select()
      .from(documentsSchema)
      .where(eq(documentsSchema.userId, userId))
      .orderBy(documentsSchema.updatedAt);

    return createSuccessResponse(documents);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to fetch documents');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();

    const { title, emoji, content, folder } = body;

    if (!title) {
      return createErrorResponse('Title is required');
    }

    // Generate UUID for sharing
    const shareId = crypto.randomUUID();

    const newDocument = await db
      .insert(documentsSchema)
      .values({
        userId,
        title,
        emoji: emoji || '📄',
        content: content || '',
        folder: folder || 'General',
        shareId,
        isPublic: false,
      })
      .returning();

    return createSuccessResponse(newDocument[0], 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to create document');
  }
}