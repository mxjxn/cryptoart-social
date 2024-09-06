import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const { hash } = params;
  const users = await getUsersByCast(hash);
  return NextResponse.json({ users });
}

async function getUsersByCast(hash: string): Promise<string[]> {
  const users = await kv.smembers(`cast:${hash}:users`);
  return users;
}