<script lang="ts">
	import type { StopDirection } from '$lib/StopDirection';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import Trip from './Trip.svelte';
	interface Props {
		direction: StopDirection;
		alone?: boolean;
	}
	let { direction, alone = false }: Props = $props();

	const COLLAPSED_LIMIT = 5;

	let expanded = $state(false);
	let limit = $derived(expanded || alone ? direction.trips.length : COLLAPSED_LIMIT);
	let showMoreInProgress = $state(false);
</script>

<div class="mt-10 flex flex-col">
	{#if !alone && direction.name}
		<div class="mx-auto mb-4 w-fit text-center text-lg font-medium uppercase">
			{direction.name}
		</div>
	{/if}
	{#if direction.trips.length > 0}
		{#each direction.trips.slice(0, limit) as trip (trip.id)}
			<div
				animate:flip={{
					delay: 0,
					duration: 300,
				}}
				in:fade={{ delay: showMoreInProgress ? 0 : 800, duration: 300 }}
				out:fade={{ duration: 300 }}
			>
				<Trip {trip} />
			</div>
		{/each}

		{#if !expanded && !alone && direction.trips.length > COLLAPSED_LIMIT}
			<button
				class="mt-2 cursor-pointer rounded-md bg-neutral-800 px-3 py-1 text-mid no-underline hover:bg-neutral-700"
				onclick={() => {
					expanded = !expanded;
					showMoreInProgress = true;
					setTimeout(() => {
						showMoreInProgress = false;
					}, 50);
				}}
			>
				Mostra altri {direction.trips.length - COLLAPSED_LIMIT}
			</button>
		{/if}
	{:else}
		<div class="text-center">Nessun autobus previsto per oggi</div>
	{/if}
</div>
