import type { Preview } from "@storybook-vue/nuxt";
import "./assets/main.css";

const preview: Preview = {
    parameters: {
        layout: "centered w-[40rem]",
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
