import Image from "next/image";
import type { PostMeta } from "@/lib/notion";
import styles from "@/styles/post.module.scss";

export default function PostHeader({ meta }: { meta: PostMeta }) {
  return (
    <header className={styles.postHeader}>
      {meta.coverUrl && (
        <div className={styles.postCover}>
          <Image
            src={meta.coverUrl}
            alt={meta.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <h1 className={styles.postTitle}>{meta.title}</h1>
      <div className={styles.postInfo}>
        <span className={styles.postAuthor}>{meta.author}</span>
        <span className={styles.postDate}>
          {new Date(meta.publishedAt).toLocaleDateString()}
        </span>
        <span className={styles.postCategory}>{meta.category}</span>
      </div>
    </header>
  );
}
