import { Hono } from "hono";
import { chromeDevBlog } from "./bespoke/chrome-dev-blog.ts";
import { render } from "./feed.ts";
import { releases } from "./npm/releases.ts";
import { scrape } from "./scraper/scrape.ts";

const app = new Hono();

app.get("/bespoke/chrome-dev-blog.xml", async () => render(await chromeDevBlog()));
app.get("/npm/:pkg{.+}/releases.xml", async (ctx) => render(await releases(ctx.req.param("pkg"))));

app.get("/scraper/feed.xml", async (context) => {
  const url = context.req.query("url");
  const itemSelector = context.req.query("itemSelector");
  const titleSelector = context.req.query("titleSelector");

  if (!url) {
    return context.text('Missing "url" query parameter', 400);
  }
  if (!itemSelector) {
    return context.text('Missing "itemSelector" query parameter', 400);
  }
  if (!titleSelector) {
    return context.text('Missing "titleSelector" query parameter', 400);
  }

  return render(
    await scrape(url, {
      items: itemSelector,
      title: titleSelector,
    }),
  );
});

export default app;
