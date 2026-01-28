import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.REVALIDATE_SECRET}`)
    return new NextResponse("Unauthorized", { status: 401 });
  const body = await request.json().catch(() => ({}));
  const slug = (body as any)?.slug;
  const tags = Array.isArray((body as any)?.tags) ? (body as any).tags : [];
  if (tags.length) {
    tags.forEach((t: string) => revalidateTag(t, "default"));
  } else {
    revalidateTag("posts", "default");
    if (slug) revalidateTag(`post:${slug}`, "default");
  }
  return NextResponse.json({ revalidated: true });
}
