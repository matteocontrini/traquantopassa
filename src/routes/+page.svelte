<script lang="ts">
	import StopBlock from './StopBlock.svelte';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';

	export let data;

	$: stops = data.stops;
	$: stopsWithRanking = stops.filter(x => x.ranking !== null).sort((x, y) => y.ranking! - x.ranking!);
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>

<header>
	<h1 class="font-semibold text-4xl text-center">Tra quanto passa in...</h1>
	<div class="mt-2 text-neutral-500 text-lg text-center">Città di Trento</div>
</header>

<main>
	<div class="mt-8 flex justify-center text-mid">
		<ModesSwitch isBus={true} />
	</div>
	<div class="mt-8 flex flex-col gap-2">
		<input
			type="search"
			placeholder="🔍 Cerca fermata..."
			class="w-full px-3.5 py-2 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700"
		/>

		<select
			class="w-full py-2 px-3.5 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700">
			<option value="">🚏 Filtra per linea</option>
			{#each data.routes as route}
				<option value={route.name}>{route.name} - {route.longName}</option>
			{/each}
		</select>
	</div>

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
</main>

<footer class="mb-12 mt-14 text-center">
	<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
		ℹ️ Informazioni
	</a>
</footer>
