import { NextRequest, NextResponse } from 'next/server';
import { getClient, listPosts } from '@/lib/notion';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return NextResponse.json({ error: 'Notion credentials not configured' }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') ?? undefined;
  const start_cursor = searchParams.get('cursor') ?? undefined;
  const page_size = Number(searchParams.get('limit') ?? '10');
  const client = getClient();
  const data = await listPosts({ category, start_cursor, page_size }, client);
  return NextResponse.json(data);
}
