<script lang="ts">
	import { resolve } from '$app/paths';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import StopBlock from './StopBlock.svelte';
	import ModesSwitch from '#lib/components/ModesSwitch.svelte';
	import TabButton from '#lib/components/TabButton.svelte';
	import { getContext, onMount } from 'svelte';
	import {
		computeStopsDistances,
		getCurrentPosition,
		handleGeolocationError,
		isGeolocationGranted,
	} from '#lib/location-helpers.js';
	import type { FavoriteStops } from '#lib/storage/favorites.svelte.js';
	import { getDefaultTab, setDefaultTab, type Tab } from '#lib/storage/stops-default-tab.js';

	let { data } = $props();

	let activeTab = $state(getDefaultTab());

	let searchTerm = $state('');
	let selectedRoute = $state('');
	let escapedSearchTerm = $derived(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

	let showGeolocationButton = $state(false);
	let loadingGeolocationData = $state(false);
	let distances = $state(computeStopsDistances(data.stops));

	const favorites: FavoriteStops = getContext('favorites');

	let sortedStops = $derived(
		data.stops
			// Sort by distance
			.toSorted(
				(a, b) => (distances.get(a.code) ?? Infinity) - (distances.get(b.code) ?? Infinity),
			),
	);

	let filteredStops = $derived(
		data.stops.filter(
			(stop) =>
				// Filter by route. Evaluates to true if no route is selected
				(selectedRoute == '' ||
					stop.routeIds.has(data.routes.find((x) => x.name == selectedRoute)!.id)) &&
				// Filter by search term on both name and code. Evaluates to true if no search term is present
				(searchTerm == '' ||
					new RegExp(`\\b${escapedSearchTerm}`, 'i').test(stop.name) ||
					stop.slugs.some((slug) => slug.includes(searchTerm))),
		),
	);

	let rankedStops = $derived(
		data.stops
			.filter((x) => data.rankings[x.code])
			.toSorted((x, y) => data.rankings[y.code] - data.rankings[x.code]),
	);

	let favoriteStops = $derived(data.stops.filter((x) => favorites.value.includes(x.code)));

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

		distances = computeStopsDistances(data.stops, position.coords);
	}

	function switchTab(tab: Tab) {
		activeTab = tab;
		searchTerm = '';
		selectedRoute = '';
		setDefaultTab(tab);
	}

	export const snapshot = {
		capture: () => ({
			searchTerm,
			selectedRoute,
		}),
		restore: (values) => {
			searchTerm = values.searchTerm;
			selectedRoute = values.selectedRoute;
		},
	};
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>

<header>
	<h1 class="text-center text-4xl font-semibold">Tra quanto passa in...</h1>
	<div class="mt-2 text-center text-lg text-neutral-500">Città di Trento</div>
</header>

<main>
	<div class="mt-8 flex justify-center">
		<ModesSwitch isBus={true} />
	</div>

	<div class="mt-8 flex gap-2 max-sm:flex-wrap xs:gap-3" style="scrollbar-width: none">
		<TabButton
			text="📍 Più vicine"
			isSelected={activeTab === 'all'}
			onClick={() => switchTab('all')}
		/>
		<TabButton
			text="📊 Più usate"
			isSelected={activeTab === 'ranked'}
			onClick={() => switchTab('ranked')}
		/>
		<TabButton
			text="🔍 Cerca"
			isSelected={activeTab === 'filter'}
			onClick={() => switchTab('filter')}
		/>
		<TabButton
			text="⭐️ Preferiti"
			isSelected={activeTab === 'favorites'}
			onClick={() => switchTab('favorites')}
		/>
	</div>

	{#if activeTab === 'all' || activeTab === 'filter'}
		<div
			class={activeTab === 'all' && (showGeolocationButton || loadingGeolocationData)
				? 'mt-4'
				: 'mt-8'}
		>
			{#if activeTab === 'all' && showGeolocationButton}
				<button onclick={updatePosition} in:slide class="block w-full px-3.5 py-2 text-center">
					⚠️ Consenti accesso alla posizione
				</button>
			{:else if activeTab === 'all' && loadingGeolocationData}
				<div class="w-full px-3.5 py-2 text-center">⏳ Caricamento posizione...</div>
			{/if}

			{#if activeTab === 'filter'}
				<div class="mt-4 flex gap-x-4 gap-y-3 max-sm:flex-col">
					<div class="flex basis-1/2 gap-x-2">
						<input
							type="search"
							placeholder="🔍 Cerca fermata..."
							class="w-full rounded-md bg-neutral-800 px-3.5 py-2 text-neutral-100 focus:outline-2 focus:outline-neutral-700"
							bind:value={searchTerm}
						/>
						<a
							href={resolve('/aiuto')}
							class="flex w-fit items-center justify-center rounded-md bg-neutral-800 px-3 no-underline hover:bg-neutral-700"
						>
							❓
						</a>
					</div>

					<select
						bind:value={selectedRoute}
						class="w-full basis-1/2 rounded-md bg-neutral-800 px-3.5 py-2 text-neutral-100 focus:outline-2 focus:outline-neutral-700"
					>
						<option value="">🚏 Filtra per linea</option>
						{#each data.routes as route (route.id)}
							<option value={route.name}>{route.name} - {route.longName}</option>
						{/each}
					</select>
				</div>

				{#if searchTerm || selectedRoute}
					<button
						class="mt-4 w-full rounded-md bg-neutral-800 px-3.5 py-2 hover:bg-neutral-700"
						onclick={() => {
							searchTerm = '';
							selectedRoute = '';
						}}
					>
						❌ Rimuovi filtri
					</button>
				{/if}
			{/if}

			<div class="mt-4 grid gap-4 text-lg sm:grid-cols-2">
				{#each activeTab === 'all' ? sortedStops : filteredStops as stop (stop.slugs[0])}
					<StopBlock {stop} routes={data.routes} />
				{/each}
			</div>
		</div>
	{:else if activeTab === 'ranked'}
		<div class="mt-8 grid gap-4 text-lg sm:grid-cols-2">
			{#each rankedStops as stop (stop.slugs[0])}
				<StopBlock {stop} routes={data.routes} />
			{/each}
		</div>
	{:else}
		<div class="mt-8">
			{#if favoriteStops.length === 0}
				<p class="mb-2 text-center text-neutral-500">
					Premi l'icona della stella su una fermata per aggiungerla ai preferiti.
				</p>
			{/if}

			<div class="grid gap-4 text-lg sm:grid-cols-2">
				{#each favoriteStops as stop (stop.slugs[0])}
					<div
						class="flex shrink-0"
						animate:flip={{ duration: 500, delay: 1000 }}
						out:fade={{ delay: 1000, duration: 100 }}
					>
						<StopBlock {stop} routes={data.routes} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</main>

<footer class="mt-14 mb-12 text-center">
	<a
		class="rounded-md bg-neutral-800 px-3 py-2 no-underline hover:bg-neutral-700"
		href={resolve('/info')}
	>
		ℹ️ Informazioni
	</a>
</footer>
