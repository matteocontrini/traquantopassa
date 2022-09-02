import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    typescript: {
        strict: true,
    },
    imports: {
        autoImport: false,
    },
    modules: ['@nuxtjs/tailwindcss'],
    tailwindcss: {
        cssPath: '~/assets/main.css',
    },
    runtimeConfig: {
        apiBaseUrl: '',
        apiUsername: '',
        apiPassword: '',
    },
});
