export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    modules: ['@pinia/nuxt'],
    ssr: true,
    runtimeConfig: {
        // Database
        database: {
            "host": process.env.DB_HOST,
            "port": process.env.DB_PORT,
            "database": process.env.DB_DATABASE,
            "user": process.env.DB_USERNAME,
            "password": process.env.DB_PASSWORD,
            "multipleStatements": true
        },
    },
    app: {
        head: {
            htmlAttrs: { lang: 'nl' },
            title: 'HvA SSRF',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            script: [
                { src: 'https://kit.fontawesome.com/ffc90f94bc.js', crossorigin: 'anonymous' }
            ]
        }
    }
});