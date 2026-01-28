import { Client } from "@notionhq/client";

export type PostMeta = {
  pageId: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  publishedAt: string;
  coverUrl?: string;
};

export function getClient(token?: string) {
  const auth = token ?? process.env.NOTION_TOKEN;
  return new Client({ auth });
}

function getPlainText(arr: any[]) {
  return arr?.map((t: any) => t.plain_text ?? "").join("") ?? "";
}

function getFileUrl(fileProp: any) {
  if (
    !fileProp ||
    !Array.isArray(fileProp.files) ||
    fileProp.files.length === 0
  )
    return undefined;
  const f = fileProp.files[0];
  if (f.type === "external") return f.external.url;
  if (f.type === "file") return f.file.url;
  return undefined;
}

export async function findPageBySlug(slug: string, client?: Client) {
  const notion = client ?? getClient();
  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter: { property: "slug", rich_text: { equals: slug } },
    sorts: [{ property: "published_at", direction: "descending" }],
  });
  return res.results[0] as any;
}

export function extractMeta(page: any): PostMeta {
  const props = page.properties;
  const title = getPlainText(props.title?.title ?? []);
  const slug = getPlainText(props.slug?.rich_text ?? []);
  const author =
    props.author?.type === "people" &&
    Array.isArray(props.author.people) &&
    props.author.people[0]
      ? (props.author.people[0].name ?? "")
      : getPlainText(props.author?.rich_text ?? []);
  const category = props.category?.select?.name ?? "";
  const publishedAt = props.published_at?.date?.start ?? page.created_time;
  const coverUrl =
    getFileUrl(props.cover) ??
    page.cover?.external?.url ??
    page.cover?.file?.url;
  return {
    pageId: page.id,
    slug,
    title,
    author,
    category,
    publishedAt,
    coverUrl,
  };
}

export async function getAllBlocks(blockId: string, client?: Client) {
  const notion = client ?? getClient();
  const blocks: any[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });
    blocks.push(...res.results);
    cursor = res.next_cursor ?? undefined;
  } while (cursor);
  return blocks;
}

export async function listPosts(
  options?: { category?: string; start_cursor?: string; page_size?: number },
  client?: Client,
) {
  const notion = client ?? getClient();
  const filter: any = {
    and: [{ property: "slug", rich_text: { is_not_empty: true } }],
  };
  if (options?.category) {
    filter.and.push({
      property: "category",
      select: { equals: options.category },
    });
  }
  const res = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter,
    sorts: [{ property: "published_at", direction: "descending" }],
    start_cursor: options?.start_cursor,
    page_size: options?.page_size ?? 10,
  });
  const items = (res.results as any[]).map(extractMeta);
  return {
    items,
    next_cursor: res.next_cursor ?? null,
    has_more: res.has_more,
  };
}
