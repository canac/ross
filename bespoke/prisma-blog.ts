import type { Feed } from "../feed.ts";
import * as cheerio from "cheerio/slim";
import z from "@zod/zod";

const schema = z.object({
  props: z.object({
    pageProps: z.object({
      posts: z.array(
        z.object({
          title: z.string(),
          date: z.string(),
          slug: z.string(),
          tags: z.array(z.object({
            text: z.string(),
          })).nullable(),
        }),
      ),
    }),
  }),
});

export const prismaBlog = async (): Promise<Feed> => {
  const res = await fetch("https://prisma.io/blog");
  const $ = cheerio.load(await res.text());
  const rawData = $("#__NEXT_DATA__").html();
  console.log(JSON.parse(rawData ?? "{}"));
  const nextData = schema.parse(rawData ? JSON.parse(rawData) : {});
  return {
    title: "Prisma Blog",
    description:
      "Guides, announcements, and articles about Prisma, ORMs, databases, and the data access layer.",
    url: "https://prisma.io/blog",
    items: nextData.props.pageProps.posts.map((post) => ({
      title: post.title,
      date: new Date(post.date),
      url: `https://prisma.io/blog/${post.slug}`,
      tags: post.tags?.map((tag) => tag.text),
    })),
  };
};
