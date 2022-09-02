<script setup lang="ts">
import {useFetch, useHead, useRoute} from "#imports";
import Trip from "@/components/Trip.vue";

const route = useRoute();
const stop = route.params.stop;

interface StopResponse {
  stopName: string
  lastUpdatedAt: string
  directions: { direction: string, trips: Trip[] }[]
}

const {data, refresh} = await useFetch<StopResponse>(`/api/stops/${stop}`)

const stopName = data.value.stopName
const directions = data.value.directions
const lastUpdatedAt = data.value.lastUpdatedAt

useHead({
  title: 'Tra quanto passa in ' + stopName
})

//setInterval(refresh, 60 * 1000)

</script>

<template>
  <div class="max-w-[600px] mx-auto mt-10 px-5">
    <h1 class="font-semibold text-center text-4xl">{{ stopName }}</h1>
    <div class="text-sm text-center">aggiornato alle {{ new Date(lastUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</div>

    <div class="mt-10">
      <div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">{{ directions[0].name }}</div>
      <Trip v-for="trip in directions[0].trips" :trip="trip" :key="trip.tripId"/>

      <div class="w-fit mx-auto text-lg uppercase font-medium mt-8 mb-4 text-center">{{ directions[1].name }}</div>
      <Trip v-for="trip in directions[1].trips" :trip="trip" :key="trip.tripId"/>
    </div>
  </div>
</template>
