<script lang="ts">
	import StopBlock from './[stop]/StopBlock.svelte';

	export let data;

	const stopsWithRanking = data.stops.filter(x => x.ranking !== null).sort((x, y) => y.ranking! - x.ranking!);
</script>

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

