<script setup lang="ts">
import { useHead } from '#imports';

useHead({
    title: 'Tra quanto passa',
});
</script>

<template>
    <main>
        <p>
            I dati mostrati sul sito sono forniti da Trentino Trasporti. Se perdi l'autobus non è colpa mia. Se mancano
            i dati in tempo reale non è colpa mia.
        </p>

        <p>
            Il progetto non è comunque in alcun modo affiliato con Trentino Trasporti o con la Provincia Autonoma di
            Trento.
        </p>

        <p>
            La posizione geografica opzionalmente raccolta sulla homepage non viene mai inviata al server. Viene
            utilizzata esclusivamente sul tuo dispositivo per calcolare la distanza dalle fermate.
        </p>

        <p>
            Per contattare l'autore del sito:
            <a href="mailto:ciao@traquantopassa.in">ciao@traquantopassa.in</a>
        </p>

        <p class="mt-8">
            <NuxtLink to="/">Vai alla lista delle fermate</NuxtLink>
        </p>
    </main>
</template>
