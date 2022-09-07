<script setup lang="ts">
import { useFetch } from '#imports';

const { data: stops } = await useFetch<StopResponse>('/api/stops');
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5">
        <h1 class="font-semibold text-center text-4xl">Tra quanto passa in...</h1>

        <ul class="mt-10 text-center text-lg">
            <li v-for="stop in stops" class="mt-4">
                <NuxtLink :to="`/${stop}`">/{{ stop }}</NuxtLink>
            </li>
        </ul>

        <div class="my-10 text-neutral-500 text-sm text-center">
            <NuxtLink to="/info">Informazioni</NuxtLink>
        </div>
    </div>
</template>
