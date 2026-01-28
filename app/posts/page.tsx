import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/blog.module.scss';

export const revalidate = 300;

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ category?: string; cursor?: string }> }) {
  const { category, cursor } = await searchParams;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const qs = new URLSearchParams();
  if (category) qs.set('category', category);
  if (cursor) qs.set('cursor', cursor);
  const res = await fetch(`${origin}/api/posts?${qs.toString()}`, {
    next: { revalidate: 300, tags: ['posts'] }
  } as any);
  if (!res.ok) return null;
  const data = await res.json();
  const items = data.items as Array<{ slug: string; title: string; author: string; category: string; publishedAt: string; coverUrl?: string }>;

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Nova Solução de Armazenamento da Altatech Compatível com o Protocolo S3</h1>
          <p className={styles.heroDesc}>
            A nova plataforma da Altatech entrega resiliência, custo previsível e performance para cargas de trabalho modernas. Descubra como aplicar no seu negócio.
          </p>
          <div className={styles.heroActions}>
            <Link href="/posts/tendencias-diseno-ui-ux-2026" className={styles.primaryBtn}>Ler Artigo</Link>
          </div>
        </div>
      </section>

      <section className={styles.listing}>
        <div className={styles.listingHeader}>
          <h2 className={styles.sectionTitle}>Todos os Artigos</h2>
          <div className={styles.chips}>
            <Link href="/posts" className={!category ? styles.chipActive : styles.chip}>Todos</Link>
            {categories.map((cat) => (
              <Link key={cat} href={`/posts?category=${encodeURIComponent(cat)}`} className={category === cat ? styles.chipActive : styles.chip}>
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.cards}>
          {items.map((post) => (
            <article key={post.slug} className={styles.card}>
              <div className={styles.cardBody}>
                <Link href={`/posts/${post.slug}`} className={styles.cardTitle}>{post.title}</Link>
                <p className={styles.cardExcerpt}>
                  {post.title} — Leia para entender os principais pontos e aplicações práticas. 
                </p>
                <div className={styles.cardMeta}>
                  <span className={styles.metaAuthor}>{post.author}</span>
                  <span className={styles.metaSep}>•</span>
                  <span className={styles.metaDate}>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  {post.category ? (<><span className={styles.metaSep}>•</span><span className={styles.metaCat}>{post.category}</span></>) : null}
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/posts/${post.slug}`} className={styles.secondaryBtn}>Ler mais</Link>
                </div>
              </div>
              <div className={styles.cardThumb}>
                {post.coverUrl ? (
                  <Image src={post.coverUrl} alt={post.title} fill sizes="280px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.thumbPlaceholder} />
                )}
              </div>
            </article>
          ))}
        </div>

        {data.next_cursor ? (
          <div className={styles.loadMore}>
            <Link href={`/posts?${qs.toString()}&cursor=${encodeURIComponent(data.next_cursor)}`} className={styles.moreBtn}>Carregar Mais</Link>
          </div>
        ) : (
          <div className={styles.loadMore}>
            <span className={styles.endText}>Você chegou ao fim</span>
          </div>
        )}
      </section>

      <section className={styles.related}>
        <h3 className={styles.relatedTitle}>Artigos Relacionados</h3>
        <div className={styles.relatedGrid}>
          {items.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className={styles.relatedCard}>
              <div className={styles.relatedThumb}>
                {post.coverUrl ? (
                  <Image src={post.coverUrl} alt={post.title} fill sizes="320px" style={{ objectFit: 'cover' }} />
                ) : <div className={styles.thumbPlaceholder} />}
              </div>
              <div className={styles.relatedBody}>
                <div className={styles.relatedBadge}>{post.category || 'Artigo'}</div>
                <div className={styles.relatedText}>{post.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.newsletter}>
        <div className={styles.newsBox}>
          <div className={styles.newsIcon} />
          <div className={styles.newsContent}>
            <h4 className={styles.newsTitle}>Assine a Newsletter da Altatech</h4>
            <p className={styles.newsDesc}>Fique por dentro das novidades. Receba artigos, dicas técnicas e pesquisas relevantes.</p>
          </div>
          <form action="#" className={styles.newsForm}>
            <input className={styles.input} type="email" placeholder="Seu e-mail" />
            <button className={styles.primaryBtn} type="submit">Inscrever-se</button>
          </form>
        </div>
      </section>
    </div>
  );
}
