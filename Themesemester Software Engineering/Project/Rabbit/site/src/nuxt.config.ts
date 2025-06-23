// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    telemetry: {
        enabled: false,
        consent: 0,
    },
    nitro: {
        experimental: {
            websocket: true
        }
    },
    components: {
        dirs: [
            {
                path: "~/components",
                pathPrefix: false,
                extensions: ["vue"]
            }
        ]
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    ssr: true,
    css: [
        "./assets/main.css",
        "@flaticon/flaticon-uicons/css/solid/rounded.css",
        "@flaticon/flaticon-uicons/css/solid/straight.css",
        "@flaticon/flaticon-uicons/css/bold/rounded.css",
    ],
    modules: [
        "@nuxt/eslint",
        "@nuxt/image",
        "@nuxt/test-utils",
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/storybook",
        "nuxt-auth-utils",
        "nuxt-cron",
    ],
    cron: {
        runOnInit: true,
        timeZone: "Europe/Amsterdam",
        jobsDir: "core/tss/jobs",
    },
    router: {
        options: {
            scrollBehaviorType: "smooth",
            strict: false,
        },
    },
    piniaPluginPersistedstate: {
        storage: "sessionStorage",
        auto: true,
    },
    pinia: {
        storesDirs: ["./stores/**"],
    },
    runtimeConfig: {
        databaseHost: "",
        databasePort: "",
        databaseName: "",
        databaseUsername: "",
        databasePassword: "",
        mailHost: "",
        mailUsername: "",
        mailPassword: "",
        mailPath: "",
        meilisearchHost: "",
        meilisearchApiKey: "",
        meilisearchMasterKey: "",
        uplinkHost: "",
        uplinkPort: "",
        uplinkUsername: "",
        uplinkPassword: "",
        uplinkExchange: "",
        uplinkRouter: "",
        sftpHost: "",
        sftpPort: "",
        sftpUsername: "",
        sftpPassword: "",
        public: {
            wsUrl: ""
        }
    },
    app: {
        head: {
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                { name: "theme-color", content: "#000000" },
                {
                    name: "apple-mobile-web-app-status-bar-style",
                    content: "#000000",
                },
                { name: "apple-mobile-web-app-capable", content: "yes" },
                { name: "mobile-web-app-capable", content: "yes" },
                { name: "canonical", content: "https://www.rabbit.com/" },
                {
                    name: "keywords",
                    content:
                        "Social media, TSE, HvA, AUAS, Posting, Communities",
                },
                { name: "owner", content: "TSE Team Fristi" },
                { name: "description", content: "Hop into the latest." },
                { property: "og:type", content: "website" },
                { property: "og:site_name", content: "Rabbit" },
                { property: "og:locale", content: "en_US" },
                // { property: "og:locale:alternate", content: "nl_NL" },
                {
                    property: "og:image",
                    content:
                        "https://files.stefankruik.com/Products/1280/Rabbit.png",
                },
                { property: "og:image:alt", content: "The Rabbit logo." },
                { property: "og:image:type", content: "image/png" },
                { property: "og:image:width", content: "1280" },
                { property: "og:image:height", content: "640" },
                { property: "og:title", content: "Rabbit" },
                { property: "og:description", content: "Hop into the latest." },
                {
                    property: "twitter:image",
                    content:
                        "https://files.stefankruik.com/Products/1280/Rabbit.png",
                },
                { property: "twitter:title", content: "Hop into the latest." },
                {
                    property: "twitter:description",
                    content: "Hop into the latest.",
                },
                { property: "twitter:card", content: "summary_large_image" },
            ],
        },
    },
});
