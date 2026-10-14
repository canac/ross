import assert from "node:assert/strict";
import { test } from "node:test";
import { semverTag } from "./releases.ts";

test("semverTag returns prerelease for prerelease version", () => {
  assert.equal(semverTag(null, "1.0.0-alpha.1"), "prerelease");
  assert.equal(semverTag("1.0.0", "2.0.0-beta.1"), "prerelease");
});

test("semverTag returns major when no previous version", () => {
  assert.equal(semverTag(null, "1.0.0"), "major");
});

test("semverTag returns major for major bump", () => {
  assert.equal(semverTag("1.0.0", "2.0.0"), "major");
});

test("semverTag returns minor for minor bump", () => {
  assert.equal(semverTag("1.0.0", "1.1.0"), "minor");
});

test("semverTag returns patch for patch bump", () => {
  assert.equal(semverTag("1.0.0", "1.0.1"), "patch");
});
