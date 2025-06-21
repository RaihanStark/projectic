import { NextResponse } from 'next/server';
import { requireAuth } from '@/libs/Auth';

export async function getCurrentUserId() {
  const user = await requireAuth();
  return user.id;
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
