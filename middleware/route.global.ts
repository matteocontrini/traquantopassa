import { defineNuxtRouteMiddleware } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== from.path && process.client) {
        window.scrollTo(0, 0);
    }
});
