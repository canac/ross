import { parse } from "@lukeed/html";
import { HTTPException } from "hono/http-exception";
import type { Feed, FeedItem } from "../feed.ts";
import { validateResponse } from "../lib/error.ts";

export interface Selectors {
  items: string;
  title: string;
}

// Generate a Feed object from a URL
// selectors.items should select elements that each contain an item
// selectors.title should select an element within that item containing the text of the feed
// The item element should also contain a single <a> tag with an href attribute that is the link of the item
export async function scrape(url: string, selectors: Selectors): Promise<Feed> {
  const res = await fetch(url);
  validateResponse(res);

  const doc = parse(await res.text());
  const items: FeedItem[] = doc.all(selectors.items).flatMap((item) => {
    const title = item
      .all(selectors.title)
      .map((element) => element.text)
      .join("");
    if (!title) {
      return [];
    }

    // Allow the item itself to be the link
    const link = (item.name === "a" ? item : item.find("a"))?.getAttr("href");
    if (!link) {
      return [];
    }

    return {
      title: title.trim(),
      // Resolve the potentially relative URL into an absolute URL
      url: new URL(link, url).toString(),
    };
  });

  if (items.length === 0) {
    throw new HTTPException(404, { message: "No items found" });
  }

  return {
    // An empty <title> should fall back too
    // oxlint-disable-next-line typescript/prefer-nullish-coalescing
    title: doc.find("head > title, html > title")?.text || "Scraped Feed",
    description: `Scraped RSS feed for ${url}`,
    url,
    items,
    etag: res.headers.get("ETag"),
  };
}
