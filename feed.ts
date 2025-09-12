export interface Feed {
  title: string;
  description: string;
  url: string;
  items: FeedItem[];
}

export interface FeedItem {
  title: string;
  url: string;
  date: Date;
  tags?: string[];
}

const escape = (str: string): string =>
  str.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;");

/**
 * Render an RSS feed as a Response
 */
export const render = (feed: Feed): Response => {
  const items = feed.items.map((entry) => {
    const tags = entry.tags?.map((tag) => `
      <category>${escape(tag)}</category>`) ?? [];
    return `
    <item>
      <title>${escape(entry.title)}</title>
      <pubDate>${escape(entry.date.toUTCString())}</pubDate>
      <link>${escape(entry.url)}</link>
      <guid>${escape(entry.url)}</guid>${tags.join("")}
    </item>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(feed.title)}</title>
    <description>${escape(feed.description)}</description>
    <link>${escape(feed.url)}</link>${items.join("")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
};
