import { chromeDevBlog } from "./bespoke/chrome-dev-blog.ts";
import { render } from "./feed.ts";

const port = parseInt(Deno.env.get("PORT") ?? "", 10);
Deno.serve(
  { port: port || undefined },
  async (req) => {
    if (req.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (new URL(req.url).pathname !== "/bespoke/chrome-dev-blog.xml") {
      return new Response("Not Found", { status: 404 });
    }

    return render(await chromeDevBlog());
  },
);
