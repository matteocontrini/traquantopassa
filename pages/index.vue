<script setup lang="ts">
import { useFetch } from '#imports';

const { data: stops } = await useFetch<StopResponse>('/api/stops');
</script>

<template>
    <div>
        <header>
            <h1 class="font-semibold text-center text-4xl">Tra quanto passa l'autobus in...</h1>
            <div class="mt-2 text-center text-neutral-500 text-lg">Trento edition</div>
        </header>

        <main>
            <ul class="mt-10 text-center text-lg">
                <li v-for="stop in stops" class="mt-4">
                    <NuxtLink :to="`/${stop.slug}`" class="block no-underline">
                        {{ stop.name }}
                    </NuxtLink>
                    <NuxtLink :to="`/${stop.slug}`" class="block text-sm no-underline text-neutral-500">
                        /{{ stop.slug }}
                    </NuxtLink>
                </li>
            </ul>
        </main>

        <footer class="mb-10 mt-14 text-neutral-500 text-sm text-center">
            <NuxtLink to="/info">Informazioni</NuxtLink>
        </footer>
    </div>
</template>
