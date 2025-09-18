import { HTTPException } from "@hono/hono/http-exception";
import { load } from "cheerio";
import { ElementType } from "domelementtype";
import { Feed, FeedItem } from "../feed.ts";
import { validateResponse } from "../lib/error.ts";

export type Selectors = {
  items: string;
  title: string;
};

// Generate a Feed object from a URL
// selectors.items should select elements that each contain an item
// selectors.title should select an element within that item containing the text of the feed
// The item element should also contain a single <a> tag with an href attribute that is the link of the item
export async function scrape(
  url: string,
  selectors: Selectors,
): Promise<Feed> {
  const res = await fetch(url);
  validateResponse(res);

  const text = await res.text();
  const $ = load(text);
  const items: FeedItem[] = $(selectors.items).map((_, item) => {
    const $item = $(item);
    const title = $item.find(selectors.title).text();
    if (!title) {
      return null;
    }

    // Allow the item itself to be the link
    const $link = item.type === ElementType.Tag && item.tagName === "a"
      ? $item
      : $item.find("a");
    const link = $link.attr("href");
    if (!link) {
      return null;
    }

    return {
      title: title.trim(),
      // Resolve the potentially relative URL into an absolute URL
      url: new URL(link, url).toString(),
    };
  }).toArray().filter(Boolean);

  if (items.length === 0) {
    throw new HTTPException(404, { message: "No items found" });
  }

  return {
    title: $("head > title").text() || "Scraped Feed",
    description: `Scraped RSS feed for ${url}`,
    url,
    items,
    etag: res.headers.get("ETag"),
  };
}
