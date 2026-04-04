/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard-scss"],
  overrides: [
    {
      files: ["**/*.vue"],
      customSyntax: "postcss-html",
    },
    {
      files: ["**/*.{scss,css}"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "at-rule-no-unknown": null,
    "no-descending-specificity": null,
    "property-no-vendor-prefix": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["deep", "global"],
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep"],
      },
    ],
    "selector-class-pattern": null,
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind", "apply", "layer", "config", "variants", "responsive", "screen"],
      },
    ],
  },
};

export default config;
