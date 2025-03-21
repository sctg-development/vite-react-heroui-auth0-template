/* global process */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

import _package from "./package.json" with { type: "json" };

/**
 * Package.json type definition for React project
 *
 * Provides TypeScript typing for package.json structure with
 * common fields used in React applications
 */
export type PackageJson = {
  name: string;
  private: boolean;
  version: string;
  type: string;
  scripts: {
    dev: string;
    build: string;
    lint: string;
    preview: string;
    [key: string]: string;
  };
  dependencies: {
    react: string;
    "react-dom": string;
    "react-router-dom": string;
    [key: string]: string;
  };
  devDependencies: {
    typescript: string;
    eslint: string;
    vite: string;
    [key: string]: string;
  };
};

const packageJson: PackageJson = _package;

/**
 * Extract dependencies with a specific vendor prefix
 *
 * @param packageJson - The package.json object
 * @param vendorPrefix - Vendor namespace prefix (e.g. "@heroui")
 * @returns Array of dependency names matching the vendor prefix
 *
 * Used for chunk optimization in the build configuration
 */
export function extractPerVendorDependencies(
  packageJson: PackageJson,
  vendorPrefix: string,
): string[] {
  const dependencies = Object.keys(packageJson.dependencies || {});

  return dependencies.filter((dependency) =>
    dependency.startsWith(`${vendorPrefix}/`),
  );
}

/**
 * Vite configuration
 * @see https://vitejs.dev/config/
 */
console.warn(
  `Launching Vite with\nAUTH0_DOMAIN: ${process.env.AUTH0_DOMAIN}\nAUTH0_CLIENT_ID: ${process.env.AUTH0_CLIENT_ID}\nAUTH0_AUDIENCE: ${process.env.AUTH0_AUDIENCE}\nAUTH0_SCOPE: ${process.env.AUTH0_SCOPE}\nAPI_BASE_URL: ${process.env.API_BASE_URL}`,
);
export default defineConfig({
  define: {
    "import.meta.env.AUTH0_DOMAIN": JSON.stringify(process.env.AUTH0_DOMAIN),
    "import.meta.env.AUTH0_CLIENT_ID": JSON.stringify(
      process.env.AUTH0_CLIENT_ID,
    ),
    "import.meta.env.AUTH0_AUDIENCE": JSON.stringify(
      process.env.AUTH0_AUDIENCE,
    ),
    "import.meta.env.AUTH0_SCOPE": JSON.stringify(process.env.AUTH0_SCOPE),
    "import.meta.env.API_BASE_URL": JSON.stringify(process.env.API_BASE_URL),
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    // Inline assets smaller than 1KB
    // This is for demonstration purposes only
    // and should be adjusted based on the project requirements
    assetsInlineLimit: 1024,
    // Enable source maps for better debugging experience
    // This should be disabled in production for better performance and security
    sourcemap: true,
    rollupOptions: {
      output: {
        // Customizing the output file names
        assetFileNames: `assets/${packageJson.name}-[name]-[hash][extname]`,
        entryFileNames: `js/${packageJson.name}-[hash].js`,
        chunkFileNames: `js/${packageJson.name}-[hash].js`,
        /**
         * Manual chunk configuration for better code splitting
         *
         * Groups all @heroui dependencies into a single chunk
         * to optimize loading performance and avoid oversized chunks
         */
        manualChunks: {
          react: [
            "react",
            "react-dom",
            "react-router-dom",
            "react-i18next",
            "i18next",
            "i18next-http-backend",
          ],
          heroui: extractPerVendorDependencies(packageJson, "@heroui"),
          auth0: extractPerVendorDependencies(packageJson, "@auth0"),
        },
      },
    },
  },
});
