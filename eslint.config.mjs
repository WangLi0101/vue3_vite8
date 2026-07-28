import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

import separateTypeImportsRule from "./eslint/rules/separate-type-imports.js";

const localRulesPlugin = {
  rules: {
    "separate-type-imports": separateTypeImportsRule,
  },
};

export default [
  {
    ignores: [
      ".qoder/**",
      "dist/**",
      "node_modules/**",
      ".pnpm-store/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "*.min.js",
    ],
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
        ecmaFeatures: {
          jsx: true,
        },
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
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}"],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          sortBy: "path",
          newlinesBetween: 1,
          environment: "node",
          // 以 @/ 开头的导入识别为内部模块
          internalPattern: ["^@/"],
          groups: [
            "side-effect-style", // 纯副作用样式（如 import "./index.scss"）
            { newlinesBetween: 0 },
            "style", // 带绑定的样式（如 import styles from "./index.css"）
            "vue", // vue 核心
            { newlinesBetween: 0 },
            "builtin", // node 内置
            { newlinesBetween: 0 },
            "external", // 第三方包
            [
              "internal",
              "parent",
              "sibling",
              "index",
              "subpath",
              "tsconfig-path",
              "import",
              "unknown",
            ], // 自己的工具包及业务模块
            "components", // vue 组件（自定义组）
            "type", // 所有 import type 语句
          ],
          customGroups: [
            {
              // vue 核心包置顶
              groupName: "vue",
              elementNamePattern: ["^vue$", "^vue/.*", "^@vue/.*"],
              modifiers: ["value"],
            },
            {
              // 组件：@/components、@/layout 以及所有 .vue 文件
              groupName: "components",
              elementNamePattern: ["^@/components/", "^@/layout/", "\\.vue$"],
              modifiers: ["value"],
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
];
