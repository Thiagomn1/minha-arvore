import nextConfig from "eslint-config-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["**/node_modules/**", "**/.next/**"],
  },
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: { parser: tsparser },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];