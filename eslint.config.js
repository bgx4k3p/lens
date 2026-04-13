// eslint.config.js
// Flat ESLint config for Astro blog — adapted from accloiq

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";

// ---------------------------------------------------------------------------
// Custom plugin: file-header/enforce-header
// Enforces two-line header on .ts files:
//   Line 1: // <filepath relative to project root>
//   Line 2: // <description with at least 3 chars>
// ---------------------------------------------------------------------------
const projectRoot = import.meta.dirname;

const fileHeaderPlugin = {
  meta: { name: "file-header" },
  rules: {
    "enforce-header": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Enforce a two-line file header with filepath and description",
        },
        schema: [],
        messages: {
          missingPathComment:
            'First line must be a comment matching the file path relative to project root: "// {{expected}}"',
          missingDescription:
            "Second line must be a comment with a description of at least 3 characters: // <description>",
        },
      },
      create(context) {
        return {
          Program(node) {
            const sourceCode = context.sourceCode ?? context.getSourceCode();
            const comments = sourceCode.getAllComments();
            const lines = sourceCode.lines ?? sourceCode.getText().split("\n");

            const absolutePath = context.filename ?? context.getFilename();
            const relativePath = path
              .relative(projectRoot, absolutePath)
              .replace(/\\/g, "/");

            // --- Line 1: filepath comment ---
            const firstLine = lines[0];
            if (
              !firstLine ||
              !firstLine.startsWith("// ") ||
              firstLine.slice(3).trim() !== relativePath
            ) {
              const token =
                (comments.length > 0 && comments[0]) ||
                (node.body.length > 0 && node.body[0]) ||
                node;
              context.report({
                node: token,
                messageId: "missingPathComment",
                data: { expected: relativePath },
              });
              return; // don't check line 2 if line 1 is wrong
            }

            // --- Line 2: description comment ---
            const secondLine = lines[1];
            if (
              !secondLine ||
              !secondLine.startsWith("// ") ||
              secondLine.slice(3).trim().length < 3
            ) {
              const token =
                (comments.length > 1 && comments[1]) ||
                (comments.length > 0 && comments[0]) ||
                (node.body.length > 0 && node.body[0]) ||
                node;
              context.report({
                node: token,
                messageId: "missingDescription",
              });
            }
          },
        };
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Shared no-restricted-syntax rules — ban inline styles & enforce design tokens
// ---------------------------------------------------------------------------
const DESIGN_TOKEN_MSG =
  "Inline styles are banned. Use design token classes from src/styles/global.css.";
const HEX_MSG =
  "Hardcoded hex colors are banned. Use a design-token class instead.";
const RGBA_MSG =
  "Hardcoded rgba() is banned. Use a CSS custom-property (var(--…)) instead.";
const PALETTE_MSG =
  "Default Tailwind palette colors are banned. Map them to design tokens in global.css.";
const BW_MSG =
  "Tailwind white/black utilities are banned. Use design-token classes instead.";
const SHADOW_MSG =
  "Raw Tailwind shadow utilities are banned. Use a design-token shadow class.";
const TEXT_SIZE_MSG =
  "Raw Tailwind text-size classes are banned. Use a design-token typography class.";
const HOVER_MSG = "Use CSS hover classes from global.css.";
const ARBITRARY_MSG =
  "Arbitrary Tailwind values (e.g. text-[14px]) are banned. Use design tokens.";
const COLOR_MIX_MSG =
  "color-mix() is banned unless you add an eslint-disable comment with a reason.";

const noRestrictedSyntax = [
  "error",

  // 1. Ban inline style attribute
  {
    selector: 'JSXAttribute[name.name="style"]',
    message: DESIGN_TOKEN_MSG,
  },

  // 2. Ban hardcoded hex colors in JSX literals
  {
    selector: "JSXAttribute Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
    message: HEX_MSG,
  },

  // 3. Ban hardcoded hex in template literals
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]",
    message: HEX_MSG,
  },

  // 4. Ban hardcoded rgba() in literals (unless using var(--…))
  {
    selector: "Literal[value=/rgba\\((?!var\\(--)/]",
    message: RGBA_MSG,
  },
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/rgba\\((?!var\\(--)/]",
    message: RGBA_MSG,
  },

  // 5. Ban Tailwind default palette colors (e.g. blue-500, gray-400)
  {
    selector:
      "Literal[value=/\\b(bg|text|border|ring|outline|fill|stroke)-[a-z]+-\\d{2,3}\\b/]",
    message: PALETTE_MSG,
  },
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/\\b(bg|text|border|ring|outline|fill|stroke)-[a-z]+-\\d{2,3}\\b/]",
    message: PALETTE_MSG,
  },

  // 6. Ban white/black utilities
  {
    selector:
      "Literal[value=/\\b(bg|text|border|ring|outline|fill|stroke)-(white|black)\\b/]",
    message: BW_MSG,
  },
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/\\b(bg|text|border|ring|outline|fill|stroke)-(white|black)\\b/]",
    message: BW_MSG,
  },

  // 7. Ban raw Tailwind shadow utilities
  {
    selector: "Literal[value=/\\bshadow-(sm|md|lg|xl|2xl|inner)\\b/]",
    message: SHADOW_MSG,
  },
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/\\bshadow-(sm|md|lg|xl|2xl|inner)\\b/]",
    message: SHADOW_MSG,
  },

  // 8. Ban raw Tailwind text-size classes
  {
    selector:
      "Literal[value=/\\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\\b/]",
    message: TEXT_SIZE_MSG,
  },
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/\\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\\b/]",
    message: TEXT_SIZE_MSG,
  },

  // 9. Ban inline hover variants
  {
    selector: "Literal[value=/(?:^| )hover:(bg|text|border)-/]",
    message: HOVER_MSG,
  },

  // 10. Ban arbitrary Tailwind values (e.g. text-[14px])
  {
    selector: "Literal[value=/\\btext-\\[\\d+px\\]/]",
    message: ARBITRARY_MSG,
  },

  // 11. Ban color-mix() (disable with eslint-disable + reason)
  {
    selector: "Literal[value=/color-mix\\(/]",
    message: COLOR_MIX_MSG,
  },
  {
    selector:
      "TemplateLiteral > TemplateElement[value.raw=/color-mix\\(/]",
    message: COLOR_MIX_MSG,
  },
];

// ---------------------------------------------------------------------------
// Export flat config
// ---------------------------------------------------------------------------
export default [
  // ---- Global ignores ----
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**"],
  },

  // ---- Base JS recommended ----
  js.configs.recommended,

  // ---- TypeScript recommended ----
  ...tseslint.configs.recommended,

  // ---- Astro recommended ----
  ...eslintPluginAstro.configs.recommended,

  // ---- Prettier (must come after other configs to turn off conflicting rules) ----
  eslintConfigPrettier,

  // ---- Main rules for all files ----
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "file-header": fileHeaderPlugin,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "no-restricted-syntax": noRestrictedSyntax,
    },
  },

  // ---- .ts files: enforce file header ----
  {
    files: ["**/*.ts"],
    rules: {
      "file-header/enforce-header": "error",
    },
  },

  // ---- Turn off file-header for test files and config files ----
  {
    files: [
      "**/*.test.ts",
      "**/*.spec.ts",
      "**/__tests__/**/*.ts",
      "*.config.ts",
      "*.config.mjs",
      "*.config.js",
      "astro.config.*",
      "tailwind.config.*",
      "vitest.config.*",
      "tsconfig.json",
    ],
    rules: {
      "file-header/enforce-header": "off",
    },
  },

  // ---- .astro files: use astro-eslint-parser ----
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: (await import("astro-eslint-parser")).default,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  },
];
