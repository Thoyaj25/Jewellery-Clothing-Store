import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    // Default ignores
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Project utility scripts
    "scripts/**",
  ]),
]);

export default eslintConfig;
