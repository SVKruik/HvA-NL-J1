// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    rules: {
        indent: ["error", 4],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'any',
                component: 'always'
            },
            svg: 'always',
            math: 'always'
        }]
    },
});
