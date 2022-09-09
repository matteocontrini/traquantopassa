<script setup>
import '@fontsource/inter/variable.css';
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5">
        <Head>
            <Title>Tra quanto passa in...</Title>
            <Meta name="theme-color" content="rgb(23, 23, 23)" />
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
        </Head>

        <NuxtPage />
    </div>
</template>
