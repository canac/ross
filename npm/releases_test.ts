import { assertEquals } from "@std/assert";
import { semverTag } from "./releases.ts";

Deno.test("semverTag returns prerelease for prerelease version", () => {
  assertEquals(semverTag(null, "1.0.0-alpha.1"), "prerelease");
  assertEquals(semverTag("1.0.0", "2.0.0-beta.1"), "prerelease");
});

Deno.test("semverTag returns major when no previous version", () => {
  assertEquals(semverTag(null, "1.0.0"), "major");
});

Deno.test("semverTag returns major for major bump", () => {
  assertEquals(semverTag("1.0.0", "2.0.0"), "major");
});

Deno.test("semverTag returns minor for minor bump", () => {
  assertEquals(semverTag("1.0.0", "1.1.0"), "minor");
});

Deno.test("semverTag returns patch for patch bump", () => {
  assertEquals(semverTag("1.0.0", "1.0.1"), "patch");
});
