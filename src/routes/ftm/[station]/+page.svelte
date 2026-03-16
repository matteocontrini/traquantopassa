<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import Train from './FtmTrain.svelte';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
	import { onMount, setContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import StationFavoriteButton from '$lib/components/StationFavoriteButton.svelte';
	import type { ExpandedTripState } from '$lib/Trip';
	import LiveTripAnimation from '../../[stop]/LiveTripAnimation.svelte';
	import { Flag } from 'lucide-svelte';

	let { data } = $props();

	let details = $derived(data.details);
	let showMore = $state(false);
	let showMoreInProgress = $state(false);
	let limit = $derived(showMore ? Infinity : 5);

	const REFRESH_INTERVAL = 30 * 1000;
	let timer: ReturnType<typeof setInterval>;

	function onVisibilityChange() {
		clearInterval(timer);
		if (document.visibilityState != 'hidden') {
			invalidateAll();
			timer = setInterval(invalidateAll, REFRESH_INTERVAL);
		}
	}

	const tripState: ExpandedTripState = {
		id: null
	};
	const expandedTrip = $state(tripState);
	setContext('expandedTrip', expandedTrip);

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
	<title>Stazione di {details.name}</title>
	<link rel="canonical" href="{PUBLIC_BASE_URL}/treni/{details.canonicalSlug}" />
</svelte:head>

<header>
	<h1 class="text-center text-4xl font-semibold">
		Stazione di {details.name}
		<StationFavoriteButton stationId={details.id} className="pl-1" />
	</h1>
	<div class="mt-1 text-center text-sm">
		aggiornato alle
		{new Date(details.lastUpdatedAt).toLocaleTimeString(['it-IT'], {
			hour: '2-digit',
			minute: '2-digit'
		})}
	</div>

	{#if details.connections}
		<div class="mt-6 flex justify-center">
			<ModesSwitch selectedTab={'ftm'} connections={details.connections} />
		</div>
	{/if}
</header>

<main>
	<div class="mt-10 flex flex-col">
		{#if details.trains.length > 0}
			{#each details.trains.slice(0, limit) as train (train.id)}
				<div
					animate:flip={{ delay: 300 }}
					in:fade={{ delay: showMoreInProgress ? 0 : 800, duration: 300 }}
					out:fade={{ duration: 300 }}
				>
					<Train {train} userPosition={details.position} />
				</div>
			{/each}

			{#if !showMore && details.trains.length > limit}
				<button
					class="text-mid mt-2 rounded-md bg-neutral-800 px-3 py-1 no-underline hover:bg-neutral-700"
					onclick={() => {
						showMore = true;
						showMoreInProgress = true;
						setTimeout(() => {
							showMoreInProgress = false;
						}, 50);
					}}
				>
					Mostra tutti
				</button>
			{/if}
		{:else}
			<div class="text-center">Nessun treno previsto</div>
		{/if}
	</div>
</main>

<footer class="my-12">
	<div class="space-y-2 text-sm text-neutral-500">
		<p>
			Dati in tempo reale Algorab. Gli orari si riferiscono agli orari programmati di arrivo dei
			treni. I dati sugli autobus sostitutivi non sono presenti, verifica sul sito di Trentino
			Trasporti.
		</p>

		<p class="mt-2">
			Il pallino verde
			<LiveTripAnimation className="inline-block mx-1" live="green" />
			indica che i dati sono in tempo reale.
		</p>

		<p>
			Il simbolo
			<Flag class="inline size-4" />
			indica che la corsa terminerà in questa stazione.
		</p>

		<p>La pagina si aggiorna automaticamente ogni 30 secondi.</p>
	</div>

	<FooterNavigation className="mt-6" isBus={false} />
</footer>
