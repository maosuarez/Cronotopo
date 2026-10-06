import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Scenes drive three.js objects imperatively (uniforms, camera, renderer) from the `time` prop;
  // the React Compiler immutability rule does not model that, determinism is guaranteed by `time` instead.
  {
    files: ["src/scenes/**/*.{ts,tsx}", "src/components/player/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent worktrees and generated test artefacts.
    ".claude/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
