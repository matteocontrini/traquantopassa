<script lang="ts">
	import StopBlock from './StopBlock.svelte';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import TabButton from './TabButton.svelte';

	export let data;

	let activeTab: 'all' | 'ranked' | 'favorites' = 'all';

	let searchTerm = '';
	let selectedRoute = '';

	$: filteredStops =
		// Sort stops by distance (copy to avoid mutating the original array)
		// [...data.stops]
		// .sort((a, b) => a.distance - b.distance)
		data.stops
			.filter((stop) =>
				// Filter by route. Evaluates to true if no route is selected
				(selectedRoute == '' || stop.routeIds.has(data.routes.find(x => x.name == selectedRoute)!.id)) &&
				// Filter by search term on both name and slug. Evaluates to true if no search term is present
				(searchTerm == '' ||
					stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					stop.code.includes(searchTerm)
				)
			);

	$: stopsWithRanking = data.stops.filter(x => x.ranking !== null).sort((x, y) => y.ranking! - x.ranking!);
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

	<div class="mt-8 overflow-x-scroll whitespace-nowrap flex gap-x-4" style="scrollbar-width: none">
		<TabButton text="📍 Più vicine" isSelected={activeTab === 'all'} onClick={() => activeTab = 'all'} />
		<TabButton text="📊 Più richieste" isSelected={activeTab === 'ranked'} onClick={() => activeTab = 'ranked'} />
		<TabButton text="⭐️ Preferiti" isSelected={activeTab === 'favorites'} onClick={() => activeTab = 'favorites'} />
	</div>

	{#if activeTab === 'all'}
		<div>
			<button
				class="mt-4 px-3.5 py-2 w-full flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded-md text-ellipsis whitespace-nowrap overflow-hidden">
				⚠️ Concedi accesso alla posizione
			</button>

			<div class="mt-4 flex gap-4">
				<input
					type="search"
					placeholder="🔍 Cerca fermata..."
					class="w-full px-3.5 py-2 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700"
					bind:value={searchTerm}
				/>

				<select
					bind:value={selectedRoute}
					class="w-full py-2 px-3.5 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700">
					<option value="">🚏 Filtra per linea</option>
					{#each data.routes as route}
						<option value={route.name}>{route.name} - {route.longName}</option>
					{/each}
				</select>
			</div>

			<div class="mt-4 text-lg grid sm:grid-cols-2 gap-4">
				{#each filteredStops as stop (stop.slugs[0])}
					<div class="flex">
						<StopBlock {stop} routes={data.routes} />
					</div>
				{/each}
			</div>
		</div>
	{:else if activeTab === 'ranked'}
		<div class="mt-4 text-lg grid sm:grid-cols-2 gap-4">
			{#each stopsWithRanking as stop (stop.slugs[0])}
				<StopBlock {stop} routes={data.routes} />
			{/each}
		</div>
	{:else}
		<div class="mt-4">
			<p class="text-neutral-500 mt-2">
				Tieni premuto su una fermata per aggiungerla ai preferiti.
			</p>
		</div>
	{/if}
</main>

<footer class="mb-12 mt-14 text-center">
	<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
		ℹ️ Informazioni
	</a>
</footer>
