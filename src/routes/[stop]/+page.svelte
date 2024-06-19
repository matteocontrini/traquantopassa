<script lang="ts">
	import type { StopGroupDetails } from '$lib/StopGroupDetails';
	import Trip from './Trip.svelte';

	export let data;

	const details: StopGroupDetails = data.details;
</script>

<svelte:head>
	<title>{ details.name } - Tra quanto passa</title>
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
		<div class="mt-10">
			<div class="w-fit mx-auto text-lg uppercase font-medium mb-4 text-center">
				{ direction.name }
			</div>
			{#if direction.trips.length > 0}
				{#each direction.trips as trip (trip.id)}
					<Trip trip={trip} />
				{/each}
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
			<span class="inline-block rounded-full w-2 h-2 animate-ping bg-green-500 mr-1 mx-0.5"></span>
			indica che i dati sono in tempo reale.
		</div>

		<div class="mt-2">
			Il pallino è giallo
			<span class="inline-block rounded-full w-2 h-2 animate-ping bg-yellow-500 mr-1 mx-0.5"></span>
			se l'autobus non ha trasmesso aggiornamenti negli ultimi 5 minuti.
		</div>

		<div class="mt-2">La pagina si aggiorna automaticamente ogni 30 secondi.</div>
	</div>
</footer>
