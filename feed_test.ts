import { assertEquals } from "@std/assert";
import { type Feed, render } from "./feed.ts";

const baseFeed: Feed = {
  title: "Test Feed",
  description: "Test description",
  url: "https://example.com",
  items: [],
};

Deno.test("render empty RSS feed", async () => {
  const response = render(baseFeed);

  assertEquals(
    await response.text(),
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Test Feed</title>
    <description>Test description</description>
    <link>https://example.com</link>
  </channel>
</rss>
`,
  );
});

Deno.test("render RSS feed with items having 0, 1, and 3 tags", async () => {
  const response = render({
    ...baseFeed,
    items: [
      {
        title: "Item with no tags",
        url: "https://example.com/no-tags",
        date: new Date("2024-01-01T00:00:00Z"),
      },
      {
        title: "Item with one tag",
        url: "https://example.com/one-tag",
        tags: ["tag"],
      },
      {
        title: "Item with three tags",
        url: "https://example.com/three-tags",
        date: new Date("2024-01-03T00:00:00Z"),
        tags: ["tag1", "tag2", "tag3"],
      },
    ],
  });

  assertEquals(
    await response.text(),
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Test Feed</title>
    <description>Test description</description>
    <link>https://example.com</link>
    <item>
      <title>Item with no tags</title>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
      <link>https://example.com/no-tags</link>
      <guid>https://example.com/no-tags</guid>
    </item>
    <item>
      <title>Item with one tag</title>
      <link>https://example.com/one-tag</link>
      <guid>https://example.com/one-tag</guid>
      <category>tag</category>
    </item>
    <item>
      <title>Item with three tags</title>
      <pubDate>Wed, 03 Jan 2024 00:00:00 GMT</pubDate>
      <link>https://example.com/three-tags</link>
      <guid>https://example.com/three-tags</guid>
      <category>tag1</category>
      <category>tag2</category>
      <category>tag3</category>
    </item>
  </channel>
</rss>
`,
  );
});

Deno.test("render RSS feed with ETag header", () => {
  const etag = '"test-etag-123"';
  const response = render({ ...baseFeed, etag });

  assertEquals(response.headers.get("ETag"), etag);
});
