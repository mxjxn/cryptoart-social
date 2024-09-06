import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { fid: string } }) {
  const { fid } = params;
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') || 10);
  const startDate = searchParams.get('startDate');
  
  const casts = await getCastsByUser(fid, { limit, startDate });
  const totalCasts = await getUserCastsCount(fid);

  return NextResponse.json({ casts, totalCasts });
}

async function getCastsByUser(fid: string, options: { limit: number, startDate?: string }): Promise<string[]> {
  let casts: string[] = [];
  
  // Get cast hashes curated by user, limited by options
  const castHashes = await kv.zrange(`user:${fid}:casts`, 0, options.limit - 1);

  // Get cast details for each hash
  for (const hash of castHashes) {
    const cast = await kv.hgetall(`cast:${hash}`);
    casts.push(cast as string);
  }

  return casts;
}

async function getUserCastsCount(fid: string): Promise<number> {
  const count = await kv.zcard(`user:${fid}:casts`);
  return count;
}