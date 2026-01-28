import React from 'react';
import styles from '@/styles/post.module.scss';

function RichText({ rich }: { rich: any[] }) {
  return (
    <>
      {rich.map((t: any, i: number) => {
        const text = t.plain_text ?? '';
        const href = t.href;
        const marks = t.annotations ?? {};
        const Tag = href ? 'a' : 'span';
        const className = [
          marks.bold ? styles.bold : '',
          marks.italic ? styles.italic : '',
          marks.code ? styles.code : '',
          marks.underline ? styles.underline : '',
          marks.strikethrough ? styles.strike : ''
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <Tag key={i} className={className} href={href ?? undefined} target={href ? '_blank' : undefined} rel={href ? 'noopener' : undefined}>
            {text}
          </Tag>
        );
      })}
    </>
  );
}

export default function NotionRenderer({ blocks }: { blocks: any[] }) {
  const items: any[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const type = b.type;
    if (type === 'bulleted_list_item') {
      const group: any[] = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        group.push(blocks[i]);
        i++;
      }
      i--;
      items.push({ kind: 'ul', children: group });
      continue;
    }
    if (type === 'numbered_list_item') {
      const group: any[] = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        group.push(blocks[i]);
        i++;
      }
      i--;
      items.push({ kind: 'ol', children: group });
      continue;
    }
    items.push({ kind: 'single', block: b });
  }

  return (
    <div className={styles.postContent}>
      {items.map((item, idx) => {
        if (item.kind === 'ul') {
          return (
            <ul key={idx} className={styles.ul}>
              {item.children.map((li: any, j: number) => (
                <li key={j} className={styles.li}>
                  <RichText rich={li.bulleted_list_item.rich_text} />
                </li>
              ))}
            </ul>
          );
        }
        if (item.kind === 'ol') {
          return (
            <ol key={idx} className={styles.ol}>
              {item.children.map((li: any, j: number) => (
                <li key={j} className={styles.li}>
                  <RichText rich={li.numbered_list_item.rich_text} />
                </li>
              ))}
            </ol>
          );
        }
        const b = item.block;
        if (b.type === 'paragraph') return <p key={idx} className={styles.p}><RichText rich={b.paragraph.rich_text} /></p>;
        if (b.type === 'heading_1') return <h2 key={idx} className={styles.h1}><RichText rich={b.heading_1.rich_text} /></h2>;
        if (b.type === 'heading_2') return <h3 key={idx} className={styles.h2}><RichText rich={b.heading_2.rich_text} /></h3>;
        if (b.type === 'heading_3') return <h4 key={idx} className={styles.h3}><RichText rich={b.heading_3.rich_text} /></h4>;
        if (b.type === 'quote') return <blockquote key={idx} className={styles.quote}><RichText rich={b.quote.rich_text} /></blockquote>;
        if (b.type === 'image') {
          const src = b.image.type === 'external' ? b.image.external.url : b.image.file.url;
          const caption = b.image.caption?.[0]?.plain_text ?? '';
          return (
            <figure key={idx} className={styles.imageFigure}>
              <img src={src} alt={caption || 'image'} className={styles.image} />
              {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
            </figure>
          );
        }
        if (b.type === 'divider') return <hr key={idx} className={styles.hr} />;
        return null;
      })}
    </div>
  );
}
