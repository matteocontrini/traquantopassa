<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
	import { onMount, setContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import LiveTripAnimation from './LiveTripAnimation.svelte';
	import StopFavoriteButton from '$lib/components/StopFavoriteButton.svelte';
	import { Flag } from '@lucide/svelte';
	import type { ExpandedTripState, TimeState } from '$lib/Trip';
	import Direction from './Direction.svelte';

	let { data } = $props();

	let details = $derived(data.details);

	const tripState: ExpandedTripState = {
		id: null,
	};
	const expandedTrip = $state(tripState);
	setContext('expandedTrip', expandedTrip);

	const REFRESH_INTERVAL = 30 * 1000;
	const TIMER_UPDATE_INTERVAL = 5 * 1000;
	let timer: ReturnType<typeof setInterval>;
	const timeStateVal: TimeState = {
		now: Date.now(),
	};
	const timeState = $state(timeStateVal);
	setContext('timeState', timeState);

	function updateTime() {
		timeState.now = Date.now();
		const cacheAge = timeState.now - details.lastUpdatedAt.getTime();
		if (cacheAge > REFRESH_INTERVAL) {
			invalidateAll();
		}
	}

	function timeAgo() {
		// Round to nearest 5s
		const seconds = Math.floor((timeState.now - details.lastUpdatedAt.getTime()) / 5000) * 5;
		if (seconds <= 0) {
			return 'proprio ora';
		}
		if (seconds < 60) {
			return `${seconds} secondi fa`;
		}

		const minutes = Math.floor(seconds / 60);
		return `${minutes} ${minutes === 1 ? 'minuto' : 'minuti'} fa`;
	}

	$effect(() => {
		// Re-sync timer when data is updated
		// prevents extra 5s delay before next update
		onVisibilityChange();
	});

	function onVisibilityChange() {
		clearInterval(timer);
		if (document.visibilityState != 'hidden') {
			updateTime();
			timer = setInterval(updateTime, TIMER_UPDATE_INTERVAL);
		}
	}

	onMount(() => {
		onVisibilityChange();
		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChange);
			clearInterval(timer);
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
		aggiornato {timeAgo()}
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
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#each details.directions as direction}
		<Direction {direction} alone={details.directions.length < 2} />
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
