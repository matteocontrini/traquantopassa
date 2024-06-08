import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    typescript: {
        strict: true,
    },
    imports: {
        autoImport: false,
    },
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
    tailwindcss: {
        cssPath: '~/assets/main.css',
    },
    runtimeConfig: {
        apiBaseUrl: '',
        apiUsername: '',
        apiPassword: '',
        goatcounterToken: '',
    },
    ssr: false,
    sitemap: {
        sources: ['/api/__sitemap__/urls'],
    },
});
