import base from "@canac/oxc-config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base],
  plugins: ["node"],
  overrides: [
    {
      files: ["**/*_test.ts"],
      rules: { "typescript/no-floating-promises": "off" },
    },
  ],
});
