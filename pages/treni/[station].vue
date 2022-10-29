<script setup lang="ts">
import { onMounted, onUnmounted, ref, useHead, useLazyFetch, useRoute, watch } from '#imports';

enum ResponseError {
    NotFound = 1,
    NotMyFault = 2,
    Unknown = 3,
}

/* State */
let stationSlug: string;
const isLoading = ref(true);
let data = ref<StationsResponse | null>(null);
let error = ref<ResponseError | null>(null);
let refreshData: Function;
let timer: NodeJS.Timer;

/* Methods */
function readStationSlug() {
    const route = useRoute();
    stationSlug = route.params.station as string;
}

async function loadStation() {
    let response = useLazyFetch<StationsResponse>(() => `/api/stations/${stationSlug}`, {
        initialCache: false,
    });

    refreshData = response.refresh;

    watch(response.error, () => {
        if (response.error.value) {
            isLoading.value = false;
            error.value = ResponseError.Unknown;

            if (response.error.value instanceof Error) {
                let err: any = response.error.value;
                if (err.response) {
                    if (err.response.status === 404) {
                        error.value = ResponseError.NotFound;
                    } else if (err.response.status === 503) {
                        error.value = ResponseError.NotMyFault;
                    }
                }
            }
        } else {
            isLoading.value = false;
            error.value = null;
        }
    });

    watch(response.data, () => {
        data.value = response.data.value;

        if (data.value) {
            useHead({
                title: 'Stazione di ' + data.value.stationName,
            });

            // Initial loading finished
            if (isLoading.value) {
                isLoading.value = false;
                // Start refresh timer
                timer = startRefreshTimer();
            }
        }
    });
}

async function requestRefresh() {
    console.log('Refreshing...');
    await refreshData();
}

function startRefreshTimer(milliseconds = 30 * 1000) {
    return setInterval(requestRefresh, milliseconds);
}

async function onVisibilityChange() {
    if (document.visibilityState == 'hidden') {
        clearInterval(timer);
    } else if (error.value != ResponseError.NotFound) {
        timer = startRefreshTimer();
        await requestRefresh();
    }
}

/* Lifecycle */
onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
});

onUnmounted(() => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
});

readStationSlug();
await loadStation();
</script>

<template>
    <div>
        <div v-if="isLoading" class="text-center">Caricamento...</div>
        <div v-else-if="error" class="text-center">
            <template v-if="error === ResponseError.NotFound">
                <p>Stazione ferroviaria non trovata</p>
            </template>
            <template v-else-if="error === ResponseError.NotMyFault">
                <p>I dati sui treni non sono al momento disponibili 😕</p>
                <p>Prova a ricaricare la pagina.</p>
            </template>
            <template v-else>
                <p>Si è verificato un errore 😕</p>
                <p>Prova a ricaricare la pagina.</p>
            </template>

            <div class="my-10 text-neutral-500 text-sm text-center">
                <NuxtLink to="/treni">Lista stazioni (treni)</NuxtLink>
                -
                <NuxtLink to="/">Lista fermate (autobus)</NuxtLink>
                -
                <NuxtLink to="/info">Informazioni</NuxtLink>
            </div>
        </div>
        <template v-else-if="data">
            <header>
                <h1 class="font-semibold text-center text-4xl">Stazione di {{ data.stationName }}</h1>
                <div class="mt-1 text-sm text-center">
                    aggiornato alle
                    {{
                        new Date(data.lastUpdatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    }}
                </div>
            </header>

            <main>
                <Switch
                    v-if="data.busSlug != null"
                    class="mt-6"
                    :is-bus="false"
                    :bus-slug="data.busSlug"
                    :train-slug="stationSlug"
                />
                <div class="mt-10">
                    <Train v-for="train in data.trains" :train="train" />
                </div>
                <div v-if="data.trains.length === 0" class="text-center">Nessun treno previsto</div>
            </main>

            <footer class="my-12 text-neutral-500 text-sm">
                <div>
                    Dati RFI. I dati si riferiscono alle partenze. La granularità dei ritardi è di 5 minuti. I dati
                    sugli autobus sostitutivi non sono sempre affidabili, verifica sugli orari.
                </div>

                <div class="mt-2">
                    <span class="inline-block w-5">
                        <span class="animate-blink block rounded-full w-2 h-2 bg-white"></span>
                    </span>
                    indica che il treno è in partenza.
                </div>

                <div class="mt-2">La pagina si aggiorna automaticamente ogni 30 secondi.</div>

                <div class="mt-3">
                    <NuxtLink to="/treni">Lista stazioni (treni)</NuxtLink>
                    -
                    <NuxtLink to="/">Lista fermate (autobus)</NuxtLink>
                    -
                    <NuxtLink to="/info">Informazioni</NuxtLink>
                </div>
            </footer>
        </template>
    </div>
</template>
