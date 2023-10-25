<script setup lang="ts">
import { computed, ref, useFetch, useHead } from '#imports';

/* State */
const stops = ref<StopWithDistance[]>([]);
const isError = ref<boolean>(false);
const showSortButton = ref(false);
const sortedStops = computed(() => stops.value.toSorted((a, b) => a.distance - b.distance));

const search = ref('');
const routes = ref<Route[]>([]);
const selectedRoutes = ref('');
const filterSortedStops = computed(() => {
    if (!search && (!selectedRoutes || selectedRoutes.value === '')) {
        return sortedStops.value;
    }
    else if (!selectedRoutes || selectedRoutes.value === ''){
        return sortedStops.value.filter((stop) => 
            stop.name.toLowerCase().includes(search.value.toLowerCase()) ||
                stop.slug.toLowerCase().includes(search.value.toLowerCase()));
    }else if (!search){
        return sortedStops.value.filter((stop) => 
            stop.routes.some((route) => selectedRoutes.value.includes(route.name)));
    }else{
        return sortedStops.value.filter((stop) => 
            stop.name.toLowerCase().includes(search.value.toLowerCase()) ||
                stop.slug.toLowerCase().includes(search.value.toLowerCase()))
            .filter((stop) => 
                stop.routes.some((route) => selectedRoutes.value.includes(route.name)));
    }
});
// Event Handler
function okKeyDown(e: Event) {
    const target = e.target as HTMLInputElement;
    search.value = target.value;
}
function onRouteChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    selectedRoutes.value = target.value;
}


async function loadRoutes() {
    const res = await useFetch<Route[]>('/api/routes');
    if (res.data.value) {
        routes.value = res.data.value;
    } else if (res.error.value) {
        isError.value = true;
    }
}

/* Methods */
async function loadStops() {
    const res = await useFetch<StopWithDistance[]>('/api/stops');
    if (res.data.value) {
        stops.value = res.data.value;
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
await loadRoutes();
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

            <div class="mt-2 grid grid-cols-12 gap-4">
                <div class="flex flex-col gap-y-2 col-span-12 sm:col-span-8">
                    <label for="search" class="text-base">Cerca fermata </label>
                    <input
                        type="text"
                        id="search"
                        v-model="search"
                        class="px-3 py-1 rounded-md bg-neutral-800 text-neutral-100"
                        @keydown="okKeyDown"
                    />
                </div>
                <div class="flex flex-col gap-y-2 col-span-12 sm:col-span-4">
                    <label for="routes" class="text-base">Filtra per linea </label>
                    <select
                        id="routes"
                        v-model="selectedRoutes"
                        class="px-3 py-1 rounded-md bg-neutral-800 text-neutral-100"
                        @change="onRouteChange"
                    >
                        <option value="">Tutte</option>
                        <option v-for="route in routes" :value="route.name">
                            {{ route.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="isError" class="mt-10 text-center text-red-500">
                <p>Si è verificato un errore. Ricarica la pagina per riprovare.</p>

                <p>Se il problema persiste, contattaci.</p>
            </div>

            <div v-if="stops.length" class="mt-10 text-lg grid sm:grid-cols-2 gap-4">
                <NuxtLink
                    :to="`/${stop.slug}`"
                    v-for="stop in filterSortedStops"
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
