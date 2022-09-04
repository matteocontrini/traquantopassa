<script setup lang="ts">
import { onMounted, onUnmounted, ref, useHead, useLazyFetch, useRoute, watchEffect } from '#imports';
import Trip from '@/components/Trip.vue';
import { Ref } from '@vue/reactivity';

const route = useRoute();
const stop = route.params.stop;

const isLoading = ref(true);

onMounted(() => {
    isLoading.value = true;
});

let { data, refresh, error }: { data: Ref<StopResponse | null>; refresh: Function; error: Ref<true | Error | null> } =
    useLazyFetch<StopResponse>(() => `/api/stops/${stop}`, {
        initialCache: false,
    });

watchEffect(() => {
    if (data.value) {
        isLoading.value = false;
        useHead({
            title: 'Tra quanto passa - ' + data.value.stopName,
        });
    }
});

async function requestRefresh() {
    console.log('Refreshing...');
    await refresh();
}

function startTimer(milliseconds = 30 * 1000) {
    return setInterval(requestRefresh, milliseconds);
}

let timer = startTimer();

document.addEventListener('visibilitychange', onVisibilityChange);

async function onVisibilityChange() {
    if (document.visibilityState == 'hidden') {
        clearInterval(timer);
    } else {
        timer = startTimer();
        await requestRefresh();
    }
}

onUnmounted(() => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
});
</script>

<template>
    <main class="max-w-[600px] mx-auto mt-10 px-5">
        <div v-if="error" class="text-center">Errore</div>
        <div v-else-if="isLoading" class="text-center">Caricamento...</div>
        <div v-else-if="data">
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
                <Trip v-for="trip in direction.trips" :trip="trip" />
            </div>
        </div>

        <div class="my-10 text-neutral-500 text-sm text-center">
            <span class="inline-block rounded-full w-2 h-2 motion-safe:animate-ping bg-green-500 mr-2 mt-0.5"></span>
            Dati in tempo reale

            <br />
            <a href="mailto:ciao@traquantopassa.in" class="block mt-2 underline">ciao@traquantopassa.in</a>
        </div>
    </main>
</template>
