/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./app.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.ts", // belangrijk
    ],
    theme: {
        extend: {
            colors: {
                "fill-hover": "#262B31",
                "fill-active": "#373B41",
                brand: "#F65D24",
                "brand-hover": "#E25420",
                "brand-alt": "#0D8865",
                "brand-alt-hover": "#0C7A5B",
                "brand-negative": "#dc2626",
                main: "#0D1116",
                "main-hover": "#11151B",
                offblack: "#1E1E1E",
                font: "#EDEDED",
                "font-light": "#657999",
                "font-disabled": "#585858",
                fill: "#161B22",
                "fill-light": "#2E3745",
                "fill-light-hover": "#262B31",
                border: "#30363D",
                link: "#F65D24",
                "link-hover": "#E25420",
            },
        },
    },

    plugins: [],
};
