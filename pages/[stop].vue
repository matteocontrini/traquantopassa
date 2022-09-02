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

        <div class="mt-10">
            <div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
                {{ data.directions[0].name }}
            </div>
            <Trip v-for="trip in data.directions[0].trips" :trip="trip" :key="trip.tripId" />

            <div class="w-fit mx-auto text-lg uppercase font-medium mt-8 mb-4 text-center">
                {{ data.directions[1].name }}
            </div>
            <Trip v-for="trip in data.directions[1].trips" :trip="trip" :key="trip.tripId" />
        </div>
    </div>
</template>
