<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import Trip from './Trip.svelte';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
	import { onMount, setContext } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import LiveTripAnimation from './LiveTripAnimation.svelte';
	import StopFavoriteButton from '$lib/components/StopFavoriteButton.svelte';
	import { Flag } from '@lucide/svelte';
	import type { ExpandedTripState } from '$lib/Trip';
	import { page } from '$app/stores';

	let { data } = $props();

	let details = $derived(data.details);
	let showMore = $state(data.details.directions.length < 2);
	let limit = $derived(showMore ? 15 : 5);
	let showMoreInProgress = $state(false);

	const tripState: ExpandedTripState = {
		id: null
	};
	const expandedTrip = $state(tripState);
	setContext('expandedTrip', expandedTrip);

	const REFRESH_INTERVAL = 30 * 1000;
	let timer: ReturnType<typeof setInterval>;
	let selectedDate = $state($page.url.searchParams.get('refDateTime') || '');

	let selectedRoutes = $state<string[]>([]);
	
	let availableRoutes = $derived(
		Array.from(
			new Map(
				details.directions
					.flatMap(d => d.trips)
					.filter(t => t.routeName)
					.map(t => [t.routeName, { name: t.routeName, color: t.routeColor }])
			).values()
		).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
	);

	let filteredDirections = $derived(
		details.directions.map(direction => ({
			...direction,
			trips: selectedRoutes.length === 0
				? direction.trips
				: direction.trips.filter(trip => selectedRoutes.includes(trip.routeName))
		}))
	);

	function toggleRoute(routeName: string) {
		if (selectedRoutes.includes(routeName)) {
			selectedRoutes = selectedRoutes.filter(name => name !== routeName);
		} else {
			selectedRoutes = [...selectedRoutes, routeName];
		}
	}

	function applyDate() {
		const url = new URL($page.url);
		if (selectedDate) {
			url.searchParams.set('refDateTime', selectedDate);
		} else {
			url.searchParams.delete('refDateTime');
		}
		goto(url, { keepFocus: true });
	}

	function onVisibilityChange() {
		clearInterval(timer);
		if (document.visibilityState != 'hidden') {
			invalidateAll();
			timer = setInterval(invalidateAll, REFRESH_INTERVAL);
		}
	}

	onMount(() => {
		timer = setInterval(invalidateAll, REFRESH_INTERVAL);
		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			clearInterval(timer);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});
</script>

<svelte:head>
	<title>{details.name}</title>
	<link rel="canonical" href="{PUBLIC_BASE_URL}/{details.canonicalSlug}" />
</svelte:head>

<header>
	<div class="text-center">
		<h1 class="inline text-center text-4xl font-semibold">
			{details.name}
		</h1>
		<StopFavoriteButton stopCode={details.code} className="pl-2" />
	</div>
	<div class="mt-1 text-center text-sm">
		aggiornato alle
		{new Date(details.lastUpdatedAt).toLocaleTimeString(['it-IT'], {
			hour: '2-digit',
			minute: '2-digit'
		})}
	</div>

	{#if details.trainStationSlug}
		<div class="mt-6 flex justify-center">
			<ModesSwitch
				isBus={true}
				stopSlug={details.canonicalSlug}
				stationSlug={details.trainStationSlug}
			/>
		</div>
	{/if}
</header>

<main>
	<div class="mt-8 mb-4 flex flex-col gap-4 px-4 overflow-hidden">
		<div class="flex justify-end">
			<label class="flex shrink-0 items-center gap-2 cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors" title="Cambia data e ora">
				<input
					type="datetime-local"
					class="bg-transparent outline-none cursor-pointer"
					bind:value={selectedDate}
					oninput={applyDate}
				/>
			</label>
		</div>

		<div class="flex w-full overflow-x-auto gap-2 py-2" style="scrollbar-width: none;">
			{#each availableRoutes as route (route.name)}
				<button
					class="h-7 min-w-7 px-1 flex shrink-0 items-center justify-center rounded-md border border-black/20 text-xs font-bold text-white transition-all dark:border-white/20 {selectedRoutes.includes(route.name) ? 'scale-110 opacity-100 shadow-sm' : 'opacity-40 hover:opacity-70 grayscale-[30%]'}"
					style="background-color: {route.color || '#9ca3af'}; text-shadow: 0px 1px 2px rgba(0,0,0,0.6);"
					onclick={() => toggleRoute(route.name)}
					title="Linea {route.name}"
					aria-label="Filtra per linea {route.name}"
				>
					{route.name}
				</button>
			{/each}
		</div>
	</div>
	{#each filteredDirections as direction}
		<div class="mt-10 flex flex-col">
			{#if direction.name && details.directions.length > 1}
				<div class="mx-auto mb-4 w-fit text-center text-lg font-medium uppercase">
					{direction.name}
				</div>
			{/if}
			{#if direction.trips.length > 0}
				{#each direction.trips.slice(0, limit) as trip (trip.id)}
					<div
						animate:flip={{
							delay: 0,
							duration: 300
						}}
						in:fade={{ duration: 300 }}
						out:fade={{ duration: 300 }}
					>
						<Trip {trip} />
					</div>
				{/each}

				{#if !showMore && direction.trips.length > limit}
					<button
						class="mt-2 rounded-md bg-neutral-800 px-3 py-1 text-mid no-underline hover:bg-neutral-700 cursor-pointer"
						onclick={() => {
							showMore = true;
							showMoreInProgress = true;
							setTimeout(() => {
								showMoreInProgress = false;
							}, 50);
						}}
					>
						Mostra altri {direction.trips.length - limit}
					</button>
				{/if}
			{:else}
				<div class="text-center">Nessun autobus previsto per oggi</div>
			{/if}
		</div>
	{/each}
</main>

<footer class="my-12">
	<div class="space-y-2 text-sm text-neutral-500">
		<p>
			Il pallino verde
			<LiveTripAnimation className="inline-block mx-1" live="green" />
			indica che i dati sono in tempo reale.
		</p>

		<p>
			Il pallino è giallo
			<LiveTripAnimation className="inline-block mx-1" live="yellow" />
			se l'autobus non ha trasmesso aggiornamenti negli ultimi 5 minuti.
		</p>

		<p>
			Il simbolo
			<Flag class="inline size-4" />
			indica che la corsa terminerà a questa fermata.
		</p>

		<p>La pagina si aggiorna automaticamente ogni 30 secondi.</p>
	</div>

	<FooterNavigation className="mt-6" />
</footer>
