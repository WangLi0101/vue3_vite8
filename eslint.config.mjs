import js from "@eslint/js";
import separateTypeImportsRule from "./eslint/rules/separate-type-imports.js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

const localRulesPlugin = {
  rules: {
    "separate-type-imports": separateTypeImportsRule,
  },
};

export default [
  {
    ignores: ["dist/**", "node_modules/**", ".pnpm-store/**", "coverage/**", "*.min.js"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "vue/block-order": [
        "error",
        {
          order: ["template", "script", "style"],
        },
      ],
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["Index"],
        },
      ],
      "vue/no-v-html": "warn",
      "vue/padding-line-between-blocks": ["error", "always"],
      "vue/prefer-use-template-ref": "error",
    },
  },
  {
    files: ["**/*.{ts,mts,cts,tsx,vue}"],
    plugins: {
      local: localRulesPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "local/separate-type-imports": "error",
    },
  },
  {
    files: ["src/components/ReIcon/src/hooks.ts"],
    rules: {
      "vue/one-component-per-file": "off",
    },
  },
  {
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-debugger": "error",
    },
  },
  eslintConfigPrettier,
];
