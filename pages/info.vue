<script setup lang="ts">
import { ref, useFetch, useHead } from '#imports';
import Stats from '~/server/api/stats';

const count = ref(0);

useHead({
    title: 'Tra quanto passa',
});

const res = await useFetch<Stats>('/api/stats');
if (res.data.value) {
    count.value = res.data.value.count;
}
</script>

<template>
    <div>
        <header>
            <h1 class="font-semibold text-4xl">Tra quanto passa</h1>
        </header>

        <main class="my-8">
            <p>
                I dati degli autobus mostrati sul sito sono forniti da Trentino Trasporti. Se perdi l'autobus non è
                colpa mia. Se mancano i dati in tempo reale non è colpa mia.
            </p>

            <p>
                I dati sui treni sono forniti da Rete Ferroviaria Italiana (RFI) e sono gli stessi mostrati nelle
                stazioni ferroviarie. Se sono sbagliati non è colpa mia.
            </p>

            <p>
                Il progetto non è comunque in alcun modo affiliato con Trentino Trasporti, con la Provincia Autonoma di
                Trento o con RFI/Ferrovie dello Stato.
            </p>

            <p>
                La posizione geografica opzionalmente raccolta nelle pagine con la lista delle fermate/stazioni non
                viene mai inviata al server. Viene utilizzata esclusivamente sul tuo dispositivo per calcolare la
                distanza dalle fermate/stazioni.
            </p>

            <p>
                Per contattare l'autore del sito:
                <a href="mailto:ciao@traquantopassa.in">ciao@traquantopassa.in</a>
            </p>

            <p>
                Il codice sorgente è pubblicato
                <a target="_blank" href="https://github.com/matteocontrini/traquantopassa">su GitHub</a>.
            </p>

            <p v-if="count">
                Visitatori oggi:
                <span class="font-bold font-mono">
                    {{ count }}
                </span>
            </p>

            <p class="mt-10">
                <NuxtLink class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" to="/">
                    🚍 Lista fermate autobus
                </NuxtLink>
            </p>

            <p class="mt-6">
                <NuxtLink class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" to="/treni">
                    🚆 Lista stazioni treni
                </NuxtLink>
            </p>
        </main>
    </div>
</template>
