import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [Vue()],
    resolve: {
        alias: {
            "#components": path.resolve(__dirname, "./components"),
            "~": path.resolve(__dirname),
            "@": path.resolve(__dirname),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ["./vitest.setup.ts"],
        include: [
            "**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
            "**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        ],
        deps: {
            inline: [/@nuxt\/test-utils/],
        },
    },
});
