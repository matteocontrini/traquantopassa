import { defineNuxtConfig } from 'nuxt/config';
import sitemapDynamicRoutes from './sitemapDynamicRoutes';

// Fixes TypeScript complaints about the `sitemap` key
declare module '@nuxt/schema' {
    export interface NuxtConfig {
        sitemap?: {
            hostname: string;
            routes: () => Promise<string[]>;
        };
    }
}

export default defineNuxtConfig({
    typescript: {
        strict: true,
    },
    imports: {
        autoImport: false,
    },
    modules: ['@nuxtjs/tailwindcss', '@funken-studio/sitemap-nuxt-3'],
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
        hostname: 'https://traquantopassa.in',
        routes: sitemapDynamicRoutes,
    },
});
