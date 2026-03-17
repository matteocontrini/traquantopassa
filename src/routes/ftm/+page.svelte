<script lang="ts">
	import { resolve } from '$app/paths';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import StationBlock from './FtmStationBlock.svelte';
	import { getContext, onMount } from 'svelte';
	import type { FavoriteFtmStations } from '$lib/storage/favorites.svelte';
	import {
		computeFtmStationsDistances,
		getCurrentPosition,
		handleGeolocationError,
		isGeolocationGranted
	} from '$lib/location-helpers';
	import { getDefaultTab, setDefaultTab, type Tab } from '$lib/storage/stations-default-tab';
	import LiveTripAnimation from '../[stop]/LiveTripAnimation.svelte';

	let { data } = $props();

	let activeTab = $state(getDefaultTab());

	let searchTerm = $state('');

	let showGeolocationButton = $state(false);
	let loadingGeolocationData = $state(false);
	let distances = $state(new Map<string, number>());

	const favorites: FavoriteFtmStations = getContext('favorites');

	let sortedStations = $derived(data.stations
		// Sort by distance
		.toSorted((a, b) => (distances.get(a.stopId) ?? Infinity) - (distances.get(b.stopId) ?? Infinity))
	);

	let filteredStations = $derived(data.stations
		.filter((station) =>
			// Filter by railway. Evaluates to true if no route is selected
			// Filter by search term on the name. Evaluates to true if no search term is present
			(searchTerm == '' ||
				station.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		));

	let favoriteStations = $derived(data.stations.filter(x => favorites.value.includes(x.stopId)));

	onMount(async () => {
		if (await isGeolocationGranted()) {
			await updatePosition();
		} else {
			showGeolocationButton = true;
		}
	});

	async function updatePosition() {
		showGeolocationButton = false;
		loadingGeolocationData = true;

		let position;
		try {
			position = await getCurrentPosition();
		} catch (err) {
			handleGeolocationError(err);
			showGeolocationButton = true;
			return;
		} finally {
			loadingGeolocationData = false;
		}

		distances = computeFtmStationsDistances(data.stations, position.coords);
	}

	function switchTab(tab: Tab) {
		activeTab = tab;
		searchTerm = '';
		setDefaultTab(tab);
	}

	export const snapshot = {
		capture: () => ({
			searchTerm
		}),
		restore: (values) => {
			searchTerm = values.searchTerm;
		}
	};
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>



<header class="text-center">
	<h1 class="font-semibold text-4xl">Tra quanto passa in...</h1>
	<div class="mt-2 text-neutral-500 text-lg">Ferrovia Trento-Malé-Mezzana</div>
	<LiveTripAnimation live={"green"}/>
</header>

<main>
	<div class="mt-8 flex justify-center">
		<ModesSwitch selectedTab={'ftm'}/>
	</div>

	<div class="mt-8 flex max-sm:flex-wrap gap-2 xs:gap-3" style="scrollbar-width: none">
		<TabButton text="📍 Più vicine" isSelected={activeTab === 'all'} onClick={() => switchTab('all')} />
		<TabButton text="🔍 Cerca" isSelected={activeTab === 'filter'} onClick={() => switchTab('filter')} />
		<TabButton text="⭐️ Preferiti" isSelected={activeTab === 'favorites'} onClick={() => switchTab('favorites')} />
	</div>

	{#if activeTab === 'all' || activeTab === 'filter'}
		<div class="{activeTab === 'all' && (showGeolocationButton || loadingGeolocationData) ? 'mt-4' : 'mt-8'}">
			{#if activeTab === 'all' && showGeolocationButton}
				<button onclick={updatePosition}
								in:slide
								class="block px-3.5 py-2 w-full text-center">
					⚠️ Consenti accesso alla posizione
				</button>
			{:else if activeTab === 'all' && loadingGeolocationData}
				<div class="px-3.5 py-2 w-full text-center">
					⏳ Caricamento posizione...
				</div>
			{/if}

			{#if activeTab === 'filter'}
				<div class="mt-4 flex max-sm:flex-col gap-x-4 gap-y-3">
					<input
						type="search"
						placeholder="🔍 Cerca stazione..."
						class="w-full px-3.5 py-2 rounded-md bg-neutral-800 text-neutral-100 focus:outline-2 focus:outline-neutral-700"
						bind:value={searchTerm}
					/>
				</div>

				{#if searchTerm}
					<button class="w-full mt-4 px-3.5 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
									onclick={() => { searchTerm = ''; }}>
						❌ Rimuovi filtri
					</button>
				{/if}
			{/if}

			<div class="mt-4 text-lg grid xs:grid-cols-2 gap-4">
				{#each (activeTab === 'all' ? sortedStations : filteredStations) as station (station.stopId)}
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
				{#each favoriteStations as station (station.stopId)}
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
	<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href={resolve('/info')}>
		ℹ️ Informazioni
	</a>
</footer>
