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
    <div>
        <div v-if="error" class="text-center">Errore</div>
        <div v-else-if="isLoading" class="text-center">Caricamento...</div>
        <template v-else-if="data">
            <header>
                <h1 class="font-semibold text-center text-4xl">{{ data.stopName }}</h1>
                <div class="mt-1 text-sm flex justify-center items-center">
                    aggiornato alle
                    {{
                        new Date(data.lastUpdatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    }}
                </div>
            </header>

            <main v-for="direction in data.directions" class="mt-10">
                <div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
                    {{ direction.name }}
                </div>
                <Trip v-for="trip in direction.trips" :trip="trip" />
                <div v-if="direction.trips.length === 0" class="text-center">Nessun autobus in arrivo</div>
            </main>
        </template>

        <footer class="my-10 text-neutral-500 text-sm">
            <div>
                Il pallino
                <span
                    class="inline-block rounded-full w-2 h-2 motion-safe:animate-ping bg-green-500 mr-1 mx-0.5"
                ></span>
                indica che i dati sono in tempo reale.
            </div>

            <div class="mt-2">La pagina si aggiorna in automatico ogni 30 secondi.</div>

            <div class="mt-3">
                <NuxtLink to="/">Altre fermate</NuxtLink>
                -
                <NuxtLink to="/info">Informazioni</NuxtLink>
            </div>
        </footer>
    </div>
</template>
