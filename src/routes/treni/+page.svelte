<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import StationBlock from './StationBlock.svelte';
	import { getContext, onMount } from 'svelte';
	import { distance, getCurrentPosition, handleGeolocationError, isGeolocationGranted } from '$lib/location-helpers';
	import { type FavoritesStore } from '$lib/stores/stations-favorites';
	import { getDefaultTab, setDefaultTab, type Tab } from '$lib/storage/stations-default-tab';

	export let data;

	let activeTab = getDefaultTab();

	let searchTerm = '';
	let selectedRailway = '';

	let showGeolocationButton = false;
	let distances = new Map<string, number>();

	const favorites: FavoritesStore = getContext('favorites');

	$: sortedStations = data.stations
		// Sort by distance
		.sort((a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity));

	$: filteredStations = data.stations
		.filter((station) =>
			// Filter by railway. Evaluates to true if no route is selected
			(selectedRailway == '' || station.railways.includes(selectedRailway)) &&
			// Filter by search term on the name. Evaluates to true if no search term is present
			(searchTerm == '' ||
				station.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		);

	$: favoriteStations = data.stations.filter(x => $favorites.has(x.id));

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
			for (let station of data.stations) {
				distances.set(station.id, distance(position.coords, station.coordinates));
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
		selectedRailway = '';
		setDefaultTab(tab);
	}

	export const snapshot = {
		capture: () => ({
			searchTerm, selectedRailway
		}),
		restore: (values) => {
			searchTerm = values.searchTerm;
			selectedRailway = values.selectedRailway;
		}
	};
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>

<header class="text-center">
	<h1 class="font-semibold text-4xl">Tra quanto passa in...</h1>
	<div class="mt-2 text-neutral-500 text-lg">Ferrovia del Brennero e della Valsugana</div>
</header>

<main>
	<div class="mt-8 flex justify-center">
		<ModesSwitch isBus={false} />
	</div>

	<div class="mt-8 flex max-sm:flex-wrap gap-2 xs:gap-3" style="scrollbar-width: none">
		<TabButton text="📍 Più vicine" isSelected={activeTab === 'all'} onClick={() => switchTab('all')} />
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
				<div class="mt-4 flex max-sm:flex-col gap-x-4 gap-y-3">
					<input
						type="search"
						placeholder="🔍 Cerca stazione..."
						class="w-full basis-1/2 px-3.5 py-2 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700"
						bind:value={searchTerm}
					/>

					<select
						bind:value={selectedRailway}
						class="w-full basis-1/2 py-2 px-3.5 rounded-md bg-neutral-800 text-neutral-100 focus:outline focus:outline-2 focus:outline-neutral-700">
						<option value="">🚂 Filtra per ferrovia</option>
						{#each data.railways as railway (railway)}
							<option value={railway}>{railway}</option>
						{/each}
					</select>
				</div>

				{#if searchTerm || selectedRailway}
					<button class="w-full mt-4 px-3.5 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
									on:click={() => { searchTerm = ''; selectedRailway = ''; }}>
						❌ Rimuovi filtri
					</button>
				{/if}
			{/if}

			<div class="mt-4 text-lg grid xs:grid-cols-2 gap-4">
				{#each (activeTab === 'all' ? sortedStations : filteredStations) as station (station.id)}
					<StationBlock {station} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="mt-8">
			{#if favoriteStations.length === 0}
				<p class="mb-2 text-neutral-500 text-center">
					Premi l'icona della stella su una stazione per aggiungerla ai preferiti.
				</p>
			{/if}

			<div class="text-lg grid xs:grid-cols-2 gap-4">
				{#each favoriteStations as station (station.id)}
					<div class="flex shrink-0"
							 animate:flip={{duration: 500, delay: 1000}}
							 out:fade={{delay: 1000, duration: 100}}>
						<StationBlock {station} />
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
