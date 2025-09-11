import { chromeDevBlog } from "./bespoke/chrome-dev-blog.ts";
import { prismaBlog } from "./bespoke/prisma-blog.ts";
import { render } from "./feed.ts";

const port = parseInt(Deno.env.get("PORT") ?? "", 10);
Deno.serve(
  { port: port || undefined },
  async (req) => {
    if (req.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const pathname = new URL(req.url).pathname;
    if (pathname === "/bespoke/chrome-dev-blog.xml") {
      return render(await chromeDevBlog());
    }
    if (pathname === "/bespoke/prisma-blog.xml") {
      return render(await prismaBlog());
    }

    return new Response("Not Found", { status: 404 });
  },
);
