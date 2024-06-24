<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import Trip from './Trip.svelte';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';
	import LiveTripAnimation from './LiveTripAnimation.svelte';
	import StopFavoriteButton from '$lib/components/StopFavoriteButton.svelte';

	export let data;

	$: details = data.details;
	let showMore = data.details.directions.length < 2;
	$: limit = showMore ? 15 : 5;
	let showMoreInProgress = false;

	const REFRESH_INTERVAL = 30 * 1000;
	let timer: ReturnType<typeof setInterval>;

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
	<title>{ details.name }</title>
	<link rel="canonical" href="{PUBLIC_BASE_URL}/{details.canonicalSlug}" />
</svelte:head>

<header>
	<h1 class="font-semibold text-center text-4xl">
		{ details.name }
		<StopFavoriteButton stopCode={details.code} className="pl-1" />
	</h1>
	<div class="mt-1 text-sm text-center">
		aggiornato alle
		{
			new Date(details.lastUpdatedAt).toLocaleTimeString(['it-IT'], {
				hour: '2-digit',
				minute: '2-digit',
			})
		}
	</div>

	{#if details.trainStationSlug}
		<div class="mt-6 flex justify-center">
			<ModesSwitch isBus={true} stopSlug={details.canonicalSlug} stationSlug={details.trainStationSlug} />
		</div>
	{/if}
</header>

<main>
	{#each details.directions as direction}
		<div class="mt-10 flex flex-col">
			{#if direction.name && details.directions.length > 1}
				<div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
					{ direction.name }
				</div>
			{/if}
			{#if direction.trips.length > 0}
				{#each direction.trips.slice(0, limit) as trip (trip.id)}
					<div animate:flip={{delay: 300}}
							 in:fade={{delay: showMoreInProgress ? 0 : 800, duration: 300}}
							 out:fade={{duration: 300}}>
						<Trip trip={trip} />
					</div>
				{/each}

				{#if !showMore && direction.trips.length > limit}
					<button class="mt-2 px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700 text-mid"
									on:click={() => {
										showMore = true;
										showMoreInProgress = true;
										setTimeout(() => {
											showMoreInProgress = false;
										}, 50);
									}}>
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
	<div class="text-sm text-neutral-500">
		<div>
			Il pallino verde
			<LiveTripAnimation className="inline-block mx-1" live="green" />
			indica che i dati sono in tempo reale.
		</div>

		<div class="mt-2">
			Il pallino è giallo
			<LiveTripAnimation className="inline-block mx-1" live="yellow" />
			se l'autobus non ha trasmesso aggiornamenti negli ultimi 5 minuti.
		</div>

		<div class="mt-2">La pagina si aggiorna automaticamente ogni 30 secondi.</div>
	</div>

	<FooterNavigation className="mt-6" />
</footer>
