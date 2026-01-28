import { NextResponse, NextRequest } from "next/server";
import { extractMeta, findPageBySlug, getAllBlocks, getClient } from "@/lib/notion";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  if (!process.env.NOTION_DATABASE_ID || !process.env.NOTION_TOKEN) {
    return NextResponse.json(
      { error: "Notion credentials not configured" },
      { status: 500 },
    );
  }
  try {
    const { slug } = await context.params;
    const client = getClient();
    const page = await findPageBySlug(slug, client);
    if (!page) return new NextResponse("Not Found", { status: 404 });
    const meta = extractMeta(page);
    const blocks = await getAllBlocks(meta.pageId, client);
    return NextResponse.json({ meta, blocks });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Notion data" },
      { status: 502 },
    );
  }
}
