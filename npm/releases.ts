import type { Feed } from "../feed.ts";
import { validateResponse } from "../lib/error.ts";
import z from "@zod/zod";
import { difference, ReleaseType, tryParse } from "@std/semver";

const schema = z.object({
  description: z.string().optional(),
  versions: z.record(z.string(), z.unknown()),
  time: z.record(z.string(), z.string()),
});

export const semverTag = (
  prev: string | null,
  version: string,
): ReleaseType | null => {
  const parsed = tryParse(version);
  if (!parsed) {
    return null;
  }
  if (parsed.prerelease?.length) {
    return "prerelease";
  }
  if (!prev) {
    return "major";
  }
  const parsedPrev = tryParse(prev);
  if (!parsedPrev) {
    return null;
  }
  return difference(parsedPrev, parsed) ?? null;
};

export const releases = async (pkg: string): Promise<Feed> => {
  const res = await fetch(`https://registry.npmjs.org/${pkg}`);
  validateResponse(res);

  const data = schema.parse(await res.json());
  const times = data.time;

  const allVersions = Object.keys(data.versions).toReversed();
  const stableVersions = allVersions.filter((version) =>
    !tryParse(version)?.prerelease?.length
  );
  const prevVersions = new Map(
    stableVersions.map((
      version,
      index,
    ) => [version, stableVersions[index + 1]]),
  );

  const items = allVersions.map((version) => {
    const prevVersion = prevVersions.get(version);
    const tag = prevVersion
      ? semverTag(prevVersion ?? null, version)
      : "prerelease";
    const time = times[version];
    return {
      title: version,
      url: `https://www.npmjs.com/package/${pkg}/v/${version}`,
      date: time ? new Date(time) : undefined,
      tags: tag ? [tag] : undefined,
    };
  });

  return {
    title: `${pkg} npm releases`,
    description: data.description ?? `npm releases for ${pkg}`,
    url: `https://www.npmjs.com/package/${pkg}`,
    items,
  };
};
