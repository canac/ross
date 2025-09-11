import type { Feed } from "../feed.ts";
import z from "@zod/zod";

const schema = z.tuple([
  z.array(
    z.tuple([
      z.string(),
      z.unknown(),
      z.unknown(),
      z.unknown(),
      z.unknown(),
      z.tuple([z.number()]),
      z.string(),
    ]).rest(z.unknown()),
  ),
]).rest(z.unknown());

export const chromeDevBlog = async (): Promise<Feed> => {
  const res = await fetch("https://developer.chrome.com/_d/dynamic_content", {
    headers: {
      "accept-language": "en-US,en;q=0.9",
    },
    body: JSON.stringify([
      null,
      null,
      null,
      "type:blog",
      null,
      null,
      null,
      null,
      1000,
      null,
      null,
      null,
      2,
    ]),
    method: "POST",
  });
  const text = await res.text();
  const body = schema.parse(
    JSON.parse(text.startsWith(")]}'\n") ? text.slice(5) : text),
  );
  return {
    title: "Blog | Chrome for Developers Blog",
    description: "Latest news from the Chrome Developer Relations team",
    url: "https://developer.chrome.com/blog",
    items: body[0].map((entry) => ({
      title: entry[0],
      date: new Date(entry[5][0] * 1000),
      url: entry[6],
    })),
  };
};
