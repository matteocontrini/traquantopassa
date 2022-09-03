<script setup lang="ts">
import { useFetch, useHead, useLazyFetch, useRoute, watch, watchEffect } from '#imports';
import Trip from '@/components/Trip.vue';
import { Ref } from '@vue/reactivity';

const route = useRoute();
const stop = route.params.stop;

interface StopResponse {
    stopName: string;
    lastUpdatedAt: string;
    directions: { name: string; trips: Trip[] }[];
}

const resp = await useLazyFetch<StopResponse>(`/api/stops/${stop}`);

const data: Ref<StopResponse> = resp.data;

watchEffect(() => {
    data.value &&
        useHead({
            title: 'Tra quanto passa - ' + data.value.stopName,
        });
});

async function refresh() {
    console.log('Refreshing...');
    await resp.refresh();
}

function startTimer(milliseconds = 30 * 1000) {
    return setInterval(refresh, milliseconds);
}

let timer = startTimer();

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState == 'hidden') {
        clearInterval(timer);
    } else {
        timer = startTimer();
        await refresh();
    }
});
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5" v-if="data">
        <h1 class="font-semibold text-center text-4xl">{{ data.stopName }}</h1>
        <div class="text-sm flex justify-center items-center">
            aggiornato alle
            {{
                new Date(data.lastUpdatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            }}
            <span class="rounded-full w-2 h-2 animate-pulse bg-green-500 ml-2 mt-0.5"></span>
        </div>

        <div v-for="direction in data.directions" class="mt-10">
            <div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
                {{ direction.name }}
            </div>
            <Trip v-for="trip in direction.trips" :trip="trip" :key="trip.tripId" />
        </div>

        <div class="my-10 text-neutral-500 text-sm text-center">
            <span class="inline-block rounded-full w-2 h-2 motion-safe:animate-ping bg-green-500 mr-2 mt-0.5"></span>
            Dati in tempo reale

            <br />
            <a href="mailto:ciao@traquantopassa.in" class="block mt-2 underline">ciao@traquantopassa.in</a>
        </div>
    </div>
</template>
