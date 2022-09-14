<script setup lang="ts">
defineProps<{ trip: Trip }>();

function formatMinutes(minutes: number) {
    if (minutes < 60) {
        return `${minutes}'`;
    } else {
        let hours = Math.floor(minutes / 60);
        let minutesLeft = minutes % 60;
        if (minutesLeft === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutesLeft}m`;
        }
    }
}
</script>

<template>
    <div class="flex items-center gap-x-4 mb-2">
        <div
            class="w-10 h-10 flex-shrink-0 flex justify-center items-center font-bold text-xl rounded-md select-none"
            :style="{ backgroundColor: trip.routeColor }"
        >
            {{ trip.routeName }}
        </div>
        <div class="flex-grow whitespace-nowrap overflow-hidden">
            <span class="block leading-tight text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                {{ trip.destination }}
            </span>
            <span class="block leading-none text-xs text-neutral-500">
                <template v-if="trip.distanceInStops != null">
                    <template v-if="trip.distanceInStops === -2"> oltre la tua fermata</template>
                    <template v-else-if="trip.distanceInStops === -1"> non ancora partito</template>
                    <template v-else-if="trip.distanceInStops === 0"> alla tua fermata</template>
                    <template v-else-if="trip.distanceInStops === 1">
                        a {{ trip.distanceInStops }} fermata da te
                    </template>
                    <template v-else> a {{ trip.distanceInStops }} fermate da te </template>
                    <template v-if="trip.delay != null"> • </template>
                </template>
                <template v-if="trip.delay != null">
                    <template v-if="trip.delay === 0">in orario</template>
                    <template v-else-if="trip.delay > 0">in ritardo di {{ trip.delay }} min</template>
                    <template v-else>in anticipo di {{ -trip.delay }} min</template>
                </template>
            </span>
        </div>
        <div
            class="text-right text-xl font-semibold whitespace-nowrap"
            :class="{ 'animate-pulse': trip.minutes === 0, 'text-red-600': trip.minutes === 0 }"
        >
            {{ formatMinutes(trip.minutes) }}
        </div>
        <span class="rounded-full w-2 h-2 animate-ping" :class="{ 'bg-green-500': trip.delay != null }"></span>
    </div>
</template>
