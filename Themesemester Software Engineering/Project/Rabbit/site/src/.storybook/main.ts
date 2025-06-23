// .storybook/main.ts
import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    ],
    addons: ["@storybook/addon-essentials", "@chromatic-com/storybook"],
    framework: {
        name: "@storybook-vue/nuxt",
        options: {},
    },
    staticDirs: ["../public"],

    viteFinal: async (config) => {
        return {
            ...config,
            server: {
                ...config.server,
                watch: {
                    usePolling: true,
                    interval: 500,
                },
                proxy: {
                    "/_nuxt": "http://localhost:3000",
                },
            },
        };
    },
};

export default config;
