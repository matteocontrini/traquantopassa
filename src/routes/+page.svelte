<script lang="ts">
	import StopBlock from './StopBlock.svelte';

	export let data;

	$: stops = data.stops;
	$: stopsWithRanking = stops.filter(x => x.ranking !== null).sort((x, y) => y.ranking! - x.ranking!);
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>

<header>
	<h1 class="font-semibold text-4xl">Tra quanto passa in...</h1>
	<div class="mt-2 text-neutral-500 text-lg">Città di Trento</div>
</header>

<p class="mt-10 text-lg">
	⭐️ Preferiti
</p>

<p class="text-neutral-500 mt-2">
	Tieni premuto su una fermata per aggiungerla ai preferiti.
</p>

<p class="mt-10 text-lg">
	📊 Più richieste
</p>

<div class="mt-4 text-lg grid sm:grid-cols-2 gap-4">
	{#each stopsWithRanking as stop (stop.slugs[0])}
		<StopBlock {stop} routes={data.routes} />
	{/each}
</div>

<p class="mt-10 text-lg">
	✅ Tutte le fermate
</p>

<div class="mt-4 text-lg grid sm:grid-cols-2 gap-4">
	{#each data.stops as stop (stop.slugs[0])}
		<StopBlock {stop} routes={data.routes} />
	{/each}
</div>

<footer class="mb-12 mt-14 text-center">
	<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
		ℹ️ Informazioni
	</a>
</footer>
