<script setup lang="ts">
import { computed, ref, useFetch, useHead } from '#imports';

/* State */
const stops = ref<StopWithDistance[]>([]);
const routes = ref<Route[]>([]);
const isError = ref<boolean>(false);
const showSortButton = ref(false);
const searchTerm = ref('');
const selectedRoute = ref('');
const filteredStops = computed(() => {
    // Sort stops by distance (copy to avoid mutating the original array)
    const sortedStops = [...stops.value].sort((a, b) => a.distance - b.distance);

    return sortedStops.filter(
        (stop) =>
            // Filter by route. Evaluates to true if no route is selected
            (selectedRoute.value == '' || stop.routes.some((route) => selectedRoute.value == route.name)) &&
            // Filter by search term on both name and slug. Evaluates to true if no search term is present
            (searchTerm.value == '' ||
                stop.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                stop.slug.toLowerCase().includes(searchTerm.value.toLowerCase()))
    );
});

/* Methods */
async function loadStops() {
    const res = await useFetch<StopWithDistance[]>('/api/stops');
    if (res.data.value) {
        stops.value = res.data.value;
        // Extract routes from stops, remove duplicates and sort by name
        routes.value = stops.value
            .flatMap((stop) => stop.routes)
            .filter((route, index, self) => self.findIndex((r) => r.name === route.name) === index)
            // TODO: fix sorting
            .sort((a, b) => a.name.localeCompare(b.name));
    } else if (res.error.value) {
        isError.value = true;
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
            <div class="mt-8 flex justify-between xs:flex-row flex-col gap-2 text-mid">
                <Switch :is-bus="true" bus-slug="" train-slug="" align="left" />

                <button
                    v-if="showSortButton"
                    @click="sortByPosition"
                    class="h-8 flex items-center justify-center xs:basis-[190px] bg-neutral-800 hover:bg-neutral-700 px-3 rounded-md text-ellipsis whitespace-nowrap overflow-hidden"
                >
                    📍 Ordina per vicinanza
                </button>
            </div>

            <div class="mt-2 flex flex-row gap-2 text-mid">
                <input
                    type="search"
                    placeholder="🔍 Cerca fermata..."
                    class="basis-9/12 shrink min-w-0 h-8 pl-3 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700"
                    v-model="searchTerm"
                />
                <select
                    class="basis-4/12 xs:shrink-0 xs:basis-[190px] h-8 px-3 rounded-md bg-neutral-800"
                    v-model="selectedRoute"
                >
                    <option value="">🚏 Linea</option>
                    <option v-for="route in routes" :value="route.name">
                        {{ route.name }}
                    </option>
                </select>
            </div>
            <div v-if="isError" class="mt-10 text-center text-red-500">
                <p>Si è verificato un errore. Ricarica la pagina per riprovare.</p>

                <p>Se il problema persiste, contattaci.</p>
            </div>

            <div v-if="stops.length" class="mt-10 text-lg grid sm:grid-cols-2 gap-4">
                <NuxtLink
                    :to="`/${stop.slug}`"
                    v-for="stop in filteredStops"
                    class="bg-neutral-800 rounded-lg px-4 pt-2 pb-4 no-underline"
                >
                    {{ stop.name }}
                    <span class="block text-sm no-underline text-neutral-500"> /{{ stop.slug }} </span>
                    <div class="mt-4 flex gap-2 flex-wrap">
                        <div
                            v-for="route in stop.routes"
                            class="w-7 h-7 flex-shrink-0 flex justify-center items-center font-semibold text-base rounded select-none"
                            :style="{ backgroundColor: route.color }"
                        >
                            {{ route.name }}
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </main>

        <footer class="mb-12 mt-14 text-center">
            <NuxtLink class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" to="/info">
                ℹ️ Informazioni
            </NuxtLink>
        </footer>
    </div>
</template>
