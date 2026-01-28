import PostHeader from "@/components/PostHeader";
import NotionRenderer from "@/components/NotionRenderer";
import { headers } from "next/headers";
import styles from "@/styles/post.module.scss";

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;
  const res = await fetch(`${origin}/api/posts/${slug}`, {
    next: { revalidate: 300, tags: ["posts", `post:${slug}`] },
  } as any);
  if (!res.ok) return null;
  const { meta, blocks } = await res.json();
  return (
    <div className={styles.postPage}>
      <article className={styles.article}>
        <PostHeader meta={meta} />
        <NotionRenderer blocks={blocks} />
      </article>
    </div>
  );
}
