<script setup>
import '@fontsource/inter/variable.css';
import {useHead} from "nuxt/app";

useHead({
  title: 'Tra quanto passa in...',
  meta:[
    { name: 'theme-color', content: 'rgb(23, 23, 23)' }
  ]
})
</script>

<template>
  <div>
    <NuxtPage/>
  </div>
</template>
