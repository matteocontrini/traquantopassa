<script setup lang="ts">
import { computed, ref, useFetch } from '#imports';

const stops = ref<StopWithDistance[]>([]);
const showSortButton = ref(false);
const sortedStops = computed(() => stops.value.sort((a, b) => a.distance - b.distance));

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
                alert('La richiesta di accesso alla posizione è stata negata');
            } else {
                alert("Si è verificato un errore durante l'ottenimento della posizione");
            }
        }
    );
}

await loadStops();
await checkGeo();
</script>

<template>
    <div>
        <header>
            <h1 class="font-semibold text-center text-4xl">Tra quanto passa l'autobus in...</h1>
            <div class="mt-2 text-center text-neutral-500 text-lg">Trento edition</div>
        </header>

        <main>
            <div class="text-center mt-8" v-if="showSortButton">
                <button
                    @click="sortByPosition"
                    class="cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-md"
                >
                    Ordina per vicinanza
                </button>
            </div>

            <ul class="mt-10 text-center text-lg">
                <li v-for="stop in sortedStops" class="mt-4">
                    <NuxtLink :to="`/${stop.slug}`" class="block no-underline">
                        {{ stop.name }}
                    </NuxtLink>
                    <NuxtLink :to="`/${stop.slug}`" class="block text-sm no-underline text-neutral-500">
                        /{{ stop.slug }}
                    </NuxtLink>
                </li>
            </ul>
        </main>

        <footer class="mb-10 mt-14 text-neutral-500 text-sm text-center">
            <NuxtLink to="/info">Informazioni</NuxtLink>
        </footer>
    </div>
</template>
