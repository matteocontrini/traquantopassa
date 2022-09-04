<script setup lang="ts">
import { useLazyFetch } from '#imports';

const { data: stops } = await useLazyFetch<StopResponse>('/api/stops');
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5">
        <h1 class="font-semibold text-center text-4xl">Tra quanto passa in...</h1>

        <ul class="mt-10 text-center text-lg">
            <li v-for="stop in stops" class="mt-4">
                <NuxtLink :to="`/${stop}`">/{{ stop }}</NuxtLink>
            </li>
        </ul>
    </div>
</template>
