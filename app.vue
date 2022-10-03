<script setup>
import '@fontsource/inter/variable.css';
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5">
        <Head>
            <Title>Tra quanto passa</Title>
            <Meta name="theme-color" content="#171717" />
            <Script
                children="if (window.location.host !== 'traquantopassa.in') window.goatcounter = { no_onload: true };"
                body="true"
            />
            <Script
                data-goatcounter="https://traquantopassa.goatcounter.com/count"
                src="https://gc.zgo.at/count.js"
                defer
                body="true"
            />
            <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
            <Link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        </Head>

        <NuxtPage />
    </div>
</template>
