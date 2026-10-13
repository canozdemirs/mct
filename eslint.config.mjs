import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Phase 5G.2A: eslint-config-next doesn't pull in base `eslint:recommended`,
  // so core JS correctness rules like no-dupe-keys aren't active by default.
  // This one specifically would have caught the Phase 5G.1E duplicate-key
  // regression (a repeated object key in organ-transplant-cleanup.mjs
  // silently overwrote earlier removal rules) before it ever ran.
  { rules: { "no-dupe-keys": "error" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
