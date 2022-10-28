<script setup lang="ts">
import { useHead } from '#imports';

useHead({
    title: 'Tra quanto passa',
});
</script>

<template>
    <main>
        <p>
            I dati degli autobus mostrati sul sito sono forniti da Trentino Trasporti. Se perdi l'autobus non è colpa
            mia. Se mancano i dati in tempo reale non è colpa mia.
        </p>

        <p>I dati sui treni sono forniti da Rete Ferroviaria Italiana (RFI). Se perdi il treno non è colpa mia.</p>

        <p>
            Il progetto non è comunque in alcun modo affiliato con Trentino Trasporti, con la Provincia Autonoma di
            Trento o con RFI/Ferrovie dello Stato.
        </p>

        <p>
            La posizione geografica opzionalmente raccolta nelle pagine con la lista delle fermate/stazioni non viene
            mai inviata al server. Viene utilizzata esclusivamente sul tuo dispositivo per calcolare la distanza dalle
            fermate/stazioni.
        </p>

        <p>
            Per contattare l'autore del sito:
            <a href="mailto:ciao@traquantopassa.in">ciao@traquantopassa.in</a>
        </p>

        <p class="mt-8">
            <NuxtLink to="/">Vai alla lista delle fermate (autobus)</NuxtLink>
        </p>

        <p class="mt-4">
            <NuxtLink to="/treni">Vai alla lista delle stazioni (treni)</NuxtLink>
        </p>
    </main>
</template>
