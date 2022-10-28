<script setup lang="ts">
// TODO: this is a huge copy paste from the other index, refactor

import { computed, ref, useFetch, useHead } from '#imports';

/* State */
const stations = ref<StationWithDistance[]>([]);
const showSortButton = ref(false);
const sortedStations = computed(() => stations.value.sort((a, b) => a.distance - b.distance));

/* Methods */
async function loadStations() {
    const res = await useFetch<StationWithDistance[]>('/api/stations');
    if (res.data.value) {
        stations.value = res.data.value;
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
            for (let station of stations.value) {
                station.distance = Math.sqrt(
                    Math.pow(station.coordinates[0] - coords.latitude, 2) +
                        Math.pow(station.coordinates[1] - coords.longitude, 2)
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
        title: 'Tra quanto passa il treno',
    });
}

/* On created */
updateHead();
await loadStations();
await checkGeo();
</script>

<template>
    <div>
        <header>
            <h1 class="font-semibold text-4xl">Tra quanto passa il treno in...</h1>
        </header>

        <main>
            <div class="mt-8" v-if="showSortButton">
                <button
                    @click="sortByPosition"
                    class="cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-md"
                >
                    Ordina per vicinanza
                </button>
            </div>

            <div class="mt-10 text-lg grid grid-cols-2 gap-4">
                <div v-for="station in sortedStations" class="bg-neutral-800 rounded-lg px-4 py-2">
                    <NuxtLink :to="`/treni/${station.slug}`" class="block no-underline">
                        {{ station.name }}
                    </NuxtLink>
                    <NuxtLink :to="`/treni/${station.slug}`" class="block text-sm no-underline text-neutral-500">
                        /{{ station.slug }}
                    </NuxtLink>
                </div>
            </div>
        </main>

        <footer class="mb-10 mt-14 text-neutral-500 text-sm text-center">
            <NuxtLink to="/info">Informazioni</NuxtLink>
        </footer>
    </div>
</template>
