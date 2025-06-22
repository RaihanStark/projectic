import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/libs/Auth';

export async function POST() {
  await removeAuthCookie();
  return NextResponse.json({ success: true });
}
