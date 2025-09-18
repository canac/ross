import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { render } from "./feed.ts";
import { chromeDevBlog } from "./bespoke/chrome-dev-blog.ts";
import { prismaBlog } from "./bespoke/prisma-blog.ts";
import { scrape } from "./scraper/scrape.ts";

const app = new Hono();

app.get(
  "/bespoke/chrome-dev-blog.xml",
  async () => render(await chromeDevBlog()),
);
app.get(
  "/bespoke/prisma-blog.xml",
  async () => render(await prismaBlog()),
);

app.get("/scraper/feed.xml", async (c) => {
  const url = c.req.query("url");
  const itemSelector = c.req.query("itemSelector");
  const titleSelector = c.req.query("titleSelector");

  if (!url) {
    return c.text('Missing "url" query parameter', 400);
  }
  if (!itemSelector) {
    return c.text('Missing "itemSelector" query parameter', 400);
  }
  if (!titleSelector) {
    return c.text('Missing "titleSelector" query parameter', 400);
  }

  return render(
    await scrape(url, {
      items: itemSelector,
      title: titleSelector,
    }),
  );
});

app.use("/*", serveStatic({ root: "./static" }));

const port = parseInt(Deno.env.get("PORT") ?? "", 10) || undefined;
Deno.serve({ port }, app.fetch);
