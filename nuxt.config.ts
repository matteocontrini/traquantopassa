import { defineNuxtConfig } from 'nuxt/config';

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
    ssr: false,
});
