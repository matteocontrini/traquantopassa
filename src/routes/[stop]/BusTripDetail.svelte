<script lang="ts">
	import { onMount } from 'svelte';
	import type { Trip } from '$lib/Trip';

	export let trip: Trip;

	const stopElements: (HTMLDivElement | undefined)[] = [];

	onMount(() => {
		// On load, show the last passed stop in the middle so it's easier to see.
		// In case no live data is available, just have the current stop in the middle.
		const stopNumber = trip.delay === null ? trip.userStopSequenceNumber : trip.currentStopSequenceNumber;
		const elementToScroll = stopElements[stopNumber - 1];
		if (elementToScroll) {
			elementToScroll.scrollIntoView({ block: 'center' });
		}
	});
</script>

<!-- This wrapper is needed to be able to add a bottom padding and avoid the slide transition jerkiness -->
<div class="pb-2">
	<div class="rounded-lg bg-neutral-800 border border-neutral-700">
		<div class="h-40 py-3 overflow-y-auto px-4">
			{#each trip.stopTimes as stopTime, i}
				{@const wasPassed = i < trip.currentStopSequenceNumber }
				<div bind:this={stopElements[i]} class="mb-2 flex items-center gap-x-4">
                    
					<span class="text-white-500 block w-10 text-center leading-none">
						<b>{stopTime.time}</b>
					</span>

					<div class="relative flex flex-col items-center">
						<div
							class="relative z-10 h-4 w-4 rounded-full border-black"
							class:border-2={wasPassed}
							style:background-color={wasPassed ? trip.routeColor : '#f1f1f1'}
						/>

						<!-- The trip is eliminated once it reaches the end of route so there is no need to skip this if it's the last one -->
						{#if wasPassed}
							<div class="absolute top-3 h-4 w-1.5" style:background-color={trip.routeColor} />
						{/if}
					</div>

					<span class="text-white-1000 block whitespace-nowrap leading-none">
						{#if i === trip.userStopSequenceNumber - 1 }
							<strong>La tua fermata 📍</strong>
						{:else}
							{stopTime.name}
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
