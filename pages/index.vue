<script setup lang="ts">
import { computed, ref, useFetch, useHead } from '#imports';

/* State */
const stops = ref<StopWithDistance[]>([]);
const showSortButton = ref(false);
const sortedStops = computed(() => stops.value.sort((a, b) => a.distance - b.distance));

/* Methods */
async function loadStops() {
    const res = await useFetch<StopWithDistance[]>('/api/stops');
    if (res.data.value) {
        stops.value = res.data.value;
    }
}

async function checkGeo() {
    // Safari doesn't support permissions API, so we can't check if the permission was granted
    if (!navigator.permissions) {
        showSortButton.value = true;
        return;
    }

    let permission = await navigator.permissions.query({ name: 'geolocation' });
    if (permission.state === 'granted') {
        sortByPosition();
    } else if (permission.state === 'prompt') {
        showSortButton.value = true;
    }
}

function sortByPosition() {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            showSortButton.value = false;
            let coords = pos.coords;
            for (let stop of stops.value) {
                stop.distance = Math.sqrt(
                    Math.pow(stop.coordinates[0] - coords.latitude, 2) +
                        Math.pow(stop.coordinates[1] - coords.longitude, 2)
                );
            }
        },
        (err) => {
            if (err.code == err.PERMISSION_DENIED) {
                alert(
                    'La richiesta di accesso alla posizione è stata negata. Verifica le autorizzazioni al sito nelle impostazioni del tuo browser.'
                );
            } else {
                alert("Si è verificato un errore durante l'ottenimento della posizione");
            }
        }
    );
}

function updateHead() {
    useHead({
        title: 'Tra quanto passa',
    });
}

/* On created */
updateHead();
await loadStops();
await checkGeo();
</script>

<template>
    <div>
        <header>
            <h1 class="font-semibold text-4xl">Tra quanto passa in...</h1>
            <div class="mt-2 text-neutral-500 text-lg">Città di Trento</div>
        </header>

        <main>
            <div class="mt-8 flex justify-between sm:flex-row flex-col gap-y-4">
                <Switch class="text-base" :is-bus="true" bus-slug="" train-slug="" align="left" />

                <div v-if="showSortButton">
                    <button
                        @click="sortByPosition"
                        class="cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-md"
                    >
                        Ordina per vicinanza
                    </button>
                </div>
            </div>

            <div class="mt-10 text-lg grid sm:grid-cols-2 gap-4">
                <div v-for="stop in sortedStops" class="bg-neutral-800 rounded-lg px-4 pt-2 pb-4">
                    <NuxtLink :to="`/${stop.slug}`" class="block no-underline">
                        {{ stop.name }}
                    </NuxtLink>
                    <NuxtLink :to="`/${stop.slug}`" class="block text-sm no-underline text-neutral-500">
                        /{{ stop.slug }}
                    </NuxtLink>
                    <div class="mt-4 flex gap-2 flex-wrap">
                        <div
                            v-for="route in stop.routes"
                            class="w-7 h-7 flex-shrink-0 flex justify-center items-center font-semibold text-base rounded select-none"
                            :style="{ backgroundColor: route.color }"
                        >
                            {{ route.name }}
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="mb-10 mt-14 text-neutral-500 text-sm text-center">
            <NuxtLink to="/info">Informazioni</NuxtLink>
        </footer>
    </div>
</template>
