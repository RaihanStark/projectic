import type { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { documentsSchema } from '@/models/Schema';
import { createErrorResponse, createSuccessResponse, getCurrentUserId } from '@/utils/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const document = await db
      .select()
      .from(documentsSchema)
      .where(and(eq(documentsSchema.id, Number.parseInt(id)), eq(documentsSchema.userId, userId)))
      .limit(1);

    if (document.length === 0) {
      return createErrorResponse('Document not found', 404);
    }

    return createSuccessResponse(document[0]);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to fetch document');
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

    const { title, emoji, content, folder, isPublic } = body;

    // Check if document exists and belongs to user
    const existingDocument = await db
      .select()
      .from(documentsSchema)
      .where(and(eq(documentsSchema.id, Number.parseInt(id)), eq(documentsSchema.userId, userId)))
      .limit(1);

    if (existingDocument.length === 0) {
      return createErrorResponse('Document not found', 404);
    }

    const updatedDocument = await db
      .update(documentsSchema)
      .set({
        title: title || existingDocument[0]?.title || '',
        emoji: emoji !== undefined ? emoji : existingDocument[0]?.emoji,
        content: content !== undefined ? content : existingDocument[0]?.content,
        folder: folder !== undefined ? folder : existingDocument[0]?.folder,
        isPublic: isPublic !== undefined ? isPublic : existingDocument[0]?.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(documentsSchema.id, Number.parseInt(id)))
      .returning();

    return createSuccessResponse(updatedDocument[0]);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to update document');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    // Check if document exists and belongs to user
    const existingDocument = await db
      .select()
      .from(documentsSchema)
      .where(and(eq(documentsSchema.id, Number.parseInt(id)), eq(documentsSchema.userId, userId)))
      .limit(1);

    if (existingDocument.length === 0) {
      return createErrorResponse('Document not found', 404);
    }

    await db
      .delete(documentsSchema)
      .where(eq(documentsSchema.id, Number.parseInt(id)));

    return createSuccessResponse({ message: 'Document deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Failed to delete document');
  }
}