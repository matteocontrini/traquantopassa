<script setup lang="ts">
defineProps<{ trip: Trip }>();
</script>

<template>
    <div class="flex items-center gap-x-4 mb-2">
        <div
            class="w-10 h-10 flex-shrink-0 flex justify-center items-center font-bold text-xl rounded-md select-none"
            :style="{ backgroundColor: trip.routeColor }"
        >
            {{ trip.routeName }}
        </div>
        <div class="flex-grow">
            <span class="block leading-tight text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                {{ trip.destination }}<br />
            </span>
            <span
                v-if="trip.distanceInStops != null && trip.distanceInStops <= 5"
                class="block leading-none text-xs text-neutral-500"
            >
                <template v-if="trip.distanceInStops === 0">alla tua fermata</template>
                <template v-else-if="trip.distanceInStops === 1">a {{ trip.distanceInStops }} fermata da te</template>
                <template v-else>a {{ trip.distanceInStops }} fermate da te</template>
                <template v-if="trip.delay != null">
                    <template v-if="trip.delay === 0"> • in orario</template>
                    <template v-else-if="trip.delay > 0"> • in ritardo di {{ trip.delay }} min</template>
                    <template v-else> • in anticipo di {{ -trip.delay }} min</template>
                </template>
            </span>
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
