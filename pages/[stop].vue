<script setup lang="ts">
import { useFetch, useHead, useRoute } from '#imports';
import Trip from '@/components/Trip.vue';
import { Ref } from '@vue/reactivity';

const route = useRoute();
const stop = route.params.stop;

interface StopResponse {
    stopName: string;
    lastUpdatedAt: string;
    directions: { name: string; trips: Trip[] }[];
}

const resp = await useFetch<StopResponse>(`/api/stops/${stop}`);

const data: Ref<StopResponse> = resp.data;

if (data.value) {
    useHead({
        title: 'Tra quanto passa in ' + data.value.stopName,
    });
}

setInterval(() => {
    resp.refresh();
}, 30 * 1000);
</script>

<template>
    <div class="max-w-[600px] mx-auto mt-10 px-5" v-if="data">
        <h1 class="font-semibold text-center text-4xl">{{ data.stopName }}</h1>
        <div class="text-sm text-center">
            aggiornato alle
            {{
                new Date(data.lastUpdatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            }}
        </div>

        <div v-for="direction in data.directions" class="mt-10">
            <div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
                {{ direction.name }}
            </div>
            <Trip v-for="trip in direction.trips" :trip="trip" :key="trip.tripId" />
        </div>
        </div>
    </div>
</template>
