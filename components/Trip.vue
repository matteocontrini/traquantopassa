<script setup lang="ts">
import routes from '~/routes';

defineProps<{ trip: Trip }>();
</script>

<template>
    <div class="flex items-center gap-x-4 mb-2">
        <div
            class="w-10 h-10 flex justify-center items-center font-bold text-xl rounded-md"
            :style="{ backgroundColor: routes[trip.route].color }"
        >
            {{ routes[trip.route].name }}
        </div>
        <div class="text-lg font-medium flex-grow text-ellipsis overflow-hidden whitespace-nowrap">
            {{ trip.destination }}
        </div>
        <div
            class="text-right text-xl font-semibold"
            :class="{ 'motion-safe:animate-pulse': trip.minutes === 0, 'text-red-600': trip.minutes === 0 }"
        >
            {{ trip.minutes }}'
        </div>
        <span
            class="rounded-full w-2 h-2 motion-safe:animate-ping"
            :class="{ 'bg-green-500': trip.delay != null }"
        ></span>
    </div>
</template>
