<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import StopBlock from './StopBlock.svelte';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { onMount, setContext } from 'svelte';
	import { distance, getCurrentPosition, handleGeolocationError, isGeolocationGranted } from '$lib/location-helpers';
	import { createFavoritesStore } from '$lib/stores/stops-favorites';
	import { getDefaultTab, setDefaultTab, type Tab } from '$lib/storage/stops-default-tab';

	export let data;

	let activeTab = getDefaultTab();

	let searchTerm = '';
	let selectedRoute = '';

	let showGeolocationButton = false;
	let distances = new Map<string, number>();

	const favorites = createFavoritesStore();
	setContext('favorites', favorites);

	$: sortedStops = data.stops
		// Sort by distance
		.sort((a, b) => (distances.get(a.code) ?? Infinity) - (distances.get(b.code) ?? Infinity));

	$: filteredStops = data.stops
		.filter((stop) =>
			// Filter by route. Evaluates to true if no route is selected
			(selectedRoute == '' || stop.routeIds.has(data.routes.find(x => x.name == selectedRoute)!.id)) &&
			// Filter by search term on both name and code. Evaluates to true if no search term is present
			(searchTerm == '' ||
				stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				stop.code.includes(searchTerm)
			)
		);

	$: rankedStops = data.stops.filter(x => x.ranking !== null).sort((x, y) => y.ranking! - x.ranking!);

	$: favoriteStops = data.stops.filter(x => $favorites.has(x.code));

	onMount(async () => {
		if (await isGeolocationGranted()) {
			await updatePosition();
		} else {
			showGeolocationButton = true;
		}
	});

	async function updatePosition() {
		try {
			const position = await getCurrentPosition();

			// Recalculate distances
			for (let stop of data.stops) {
				distances.set(stop.code, distance(position.coords, stop.coordinates));
			}

			distances = distances; // trigger re-render
			showGeolocationButton = false;
		} catch (err) {
			handleGeolocationError(err);
		}
	}

	function switchTab(tab: Tab) {
		activeTab = tab;
		searchTerm = '';
		selectedRoute = '';
		setDefaultTab(tab);
	}

	export const snapshot = {
		capture: () => ({
			searchTerm, selectedRoute
		}),
		restore: (values) => {
			searchTerm = values.searchTerm;
			selectedRoute = values.selectedRoute;
		}
	};
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>

<header>
	<h1 class="font-semibold text-4xl text-center">Tra quanto passa in...</h1>
	<div class="mt-2 text-neutral-500 text-lg text-center">Città di Trento</div>
</header>

<main>
	<div class="mt-8 flex justify-center">
		<ModesSwitch isBus={true} />
	</div>

	<div class="mt-8 flex max-xs:flex-wrap gap-2 xs:gap-3" style="scrollbar-width: none">
		<TabButton text="📍 Più vicine" isSelected={activeTab === 'all'} onClick={() => switchTab('all')} />
		<TabButton text="📊 Più usate" isSelected={activeTab === 'ranked'} onClick={() => switchTab('ranked')} />
		<TabButton text="🔍 Cerca" isSelected={activeTab === 'filter'} onClick={() => switchTab('filter')} />
		<TabButton text="⭐️ Preferiti" isSelected={activeTab === 'favorites'} onClick={() => switchTab('favorites')} />
	</div>

	{#if activeTab === 'all' || activeTab === 'filter'}
		<div class="{activeTab === 'all' && showGeolocationButton ? 'mt-4' : 'mt-8'}">
			{#if activeTab === 'all' && showGeolocationButton}
				<button on:click={updatePosition}
								in:slide
								class="px-3.5 py-2 w-full text-center">
					⚠️ Consenti accesso alla posizione
				</button>
			{/if}

			{#if activeTab === 'filter'}
				<div class="mt-4 flex max-xs:flex-col gap-x-4 gap-y-3">
					<div class="flex gap-x-2 basis-1/2">
						<input
							type="search"
							placeholder="🔍 Cerca fermata..."
							class="w-full px-3.5 py-2 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700"
							bind:value={searchTerm}
						/>
						<a href="/aiuto"
							 class="w-fit flex items-center justify-center px-3 rounded-md bg-neutral-800 hover:bg-neutral-700 no-underline">
							❓
						</a>
					</div>

					<select
						bind:value={selectedRoute}
						class="w-full basis-1/2 py-2 px-3.5 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700">
						<option value="">🚏 Filtra per linea</option>
						{#each data.routes as route}
							<option value={route.name}>{route.name} - {route.longName}</option>
						{/each}
					</select>
				</div>

				{#if searchTerm || selectedRoute}
					<button class="w-full mt-4 px-3.5 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
									on:click={() => { searchTerm = ''; selectedRoute = ''; }}>
						❌ Rimuovi filtri
					</button>
				{/if}
			{/if}

			<div class="mt-4 text-lg grid sm:grid-cols-2 gap-4">
				{#each (activeTab === 'all' ? sortedStops : filteredStops) as stop (stop.slugs[0])}
					<StopBlock {stop} routes={data.routes} isFavorite={$favorites.has(stop.code)} />
				{/each}
			</div>
		</div>
	{:else if activeTab === 'ranked'}
		<div class="mt-8 text-lg grid sm:grid-cols-2 gap-4">
			{#each rankedStops as stop (stop.slugs[0])}
				<StopBlock {stop} routes={data.routes} isFavorite={$favorites.has(stop.code)} />
			{/each}
		</div>
	{:else}
		<div class="mt-8">
			{#if favoriteStops.length === 0}
				<p class="mb-2 text-neutral-500 text-center">
					Premi l'icona della stella su una fermata per aggiungerla ai preferiti.
				</p>
			{/if}

			<div class="text-lg grid sm:grid-cols-2 gap-4">
				{#each favoriteStops as stop (stop.slugs[0])}
					<div class="flex shrink-0"
							 animate:flip={{duration: 500, delay: 1000}}
							 out:fade={{delay: 1000, duration: 100}}>
						<StopBlock {stop} routes={data.routes} isFavorite={true} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</main>

<footer class="mb-12 mt-14 text-center">
	<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
		ℹ️ Informazioni
	</a>
</footer>
