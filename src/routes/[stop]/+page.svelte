<script lang="ts">
	import Trip from './Trip.svelte';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	export let data;

	$: details = data.details;
	$: showMore = details.directions.length < 2;
	$: limit = showMore ? 15 : 5;

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 30 * 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{ details.name }</title>
</svelte:head>

<header>
	<h1 class="font-semibold text-center text-4xl">{ details.name }</h1>
	<div class="mt-1 text-sm text-center">
		aggiornato alle
		{
			new Date(details.lastUpdatedAt).toLocaleTimeString(['it-IT'], {
				hour: '2-digit',
				minute: '2-digit',
			})
		}
	</div>

	<!-- TODO: train switch -->
</header>

<main>
	{#each details.directions as direction}
		<div class="mt-10 flex flex-col">
			{#if direction.name}
				<div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
					{ direction.name }
				</div>
			{/if}
			{#if direction.trips.length > 0}
				{#each direction.trips.slice(0, limit) as trip (trip.id)}
					<div animate:flip={{delay: 200, duration: 1000}}
							 in:fade={{duration: 200, delay: 1000}}
							 out:fade={{duration: 200}}>
						<Trip trip={trip} />
					</div>
				{/each}

				{#if !showMore && direction.trips.length > limit}
					<button class="mt-2 px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700 text-mid"
									on:click={() => showMore = true}>
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
			<span class="inline-block rounded-full w-2 h-2 animate-ping bg-green-500 mx-1"></span>
			indica che i dati sono in tempo reale.
		</div>

		<div class="mt-2">
			Il pallino è giallo
			<span class="inline-block rounded-full w-2 h-2 animate-ping bg-yellow-500 mx-1"></span>
			se l'autobus non ha trasmesso aggiornamenti negli ultimi 5 minuti.
		</div>

		<div class="mt-2">La pagina si aggiorna automaticamente ogni 30 secondi.</div>
	</div>

	<FooterNavigation className="mt-6" />
</footer>