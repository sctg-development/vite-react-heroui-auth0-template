/**
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default [
	eslint.configs.recommended,
	{
		files: ["**/*.{js,ts}"],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: "module",
			parser: tsParser,
			globals: {
				// Ajout des globals du navigateur
				document: "readonly",
				localStorage: "readonly",
				window: "readonly",
				SVGSVGElement: "readonly",
				URL: "readonly",
				console: "readonly",
				fetch: "readonly",
				// Ajout des types Cloudflare Workers
				Env: "readonly",
				Request: "readonly",
				Response: "readonly",
				ExportedHandler: "readonly",
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: false,
				},
				projectService: true,
				//tsconfigRootDir: "./",
				lib: ["es2021"],
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		plugins: {
			"unused-imports": unusedImports,
			import: importPlugin,
			"@typescript-eslint": tseslint,
			prettier: prettierPlugin,
		},
		rules: {
			"no-console": "warn",
			"prettier/prettier": "warn",
			"no-unused-vars": "off",
			"unused-imports/no-unused-vars": "off",
			"unused-imports/no-unused-imports": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					args: "after-used",
					ignoreRestSiblings: false,
					argsIgnorePattern: "^_.*?$",
				},
			],
			"import/order": [
				"warn",
				{
					groups: [
						"type",
						"builtin",
						"object",
						"external",
						"internal",
						"parent",
						"sibling",
						"index",
					],
					pathGroups: [
						{
							pattern: "~/**",
							group: "external",
							position: "after",
						},
					],
					"newlines-between": "always",
				},
			],
			"padding-line-between-statements": [
				"warn",
				{ blankLine: "always", prev: "*", next: "return" },
				{ blankLine: "always", prev: ["const", "let", "var"], next: "*" },
				{
					blankLine: "any",
					prev: ["const", "let", "var"],
					next: ["const", "let", "var"],
				},
			],
		},
	},
	{
		ignores: [
			".now/*",
			"*.css",
			".changeset",
			"dist",
			"esm/*",
			"public/*",
			"tests/*",
			"scripts/*",
			"*.config.js",
			".DS_Store",
			"node_modules",
			"coverage",
			".next",
			"build",
			".wrangler",
			"test",
		],
	},
];
