import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { documentsSchema } from '@/models/Schema';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shareId = params.id;

    const documents = await db
      .select()
      .from(documentsSchema)
      .where(eq(documentsSchema.shareId, shareId))
      .limit(1);

    if (documents.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const document = documents[0];

    // Check if document is public
    if (!document.isPublic) {
      return NextResponse.json({ error: 'This document is not publicly shared' }, { status: 403 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching shared document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}