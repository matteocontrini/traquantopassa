<script setup>
import '@fontsource/inter/variable.css';
import { useHead } from '#head';

useHead({
    title: 'Tra quanto passa',
    meta: [{ name: 'theme-color', content: '#171717' }],
    link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
    ],
    script: [
        {
            children: "if (window.location.host !== 'traquantopassa.in') window.goatcounter = { no_onload: true };",
            tagPosition: 'bodyClose',
        },
        {
            src: 'https://gc.zgo.at/count.js',
            defer: true,
            tagPosition: 'bodyClose',
            'data-goatcounter': 'https://traquantopassa.goatcounter.com/count',
        },
    ],
});
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5">
        <NuxtPage />
    </div>
</template>
