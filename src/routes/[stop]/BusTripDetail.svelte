<script lang="ts">
	import { onMount } from 'svelte';
	import type { Trip } from '$lib/Trip';

	export let trip: Trip;

	const stopElements: (HTMLDivElement | undefined)[] = [];

	// on load show the last passed stop in the middle so it's easier to see
	onMount(() => {
        // in case no live data is available, just have the current stop in the middle
		const elementToScroll = stopElements[trip.delay ? trip.currentStopSequenceNumber - 1 : trip.userStopSequenceNumber];
		if (elementToScroll) {
			elementToScroll.scrollIntoView({ block: 'center' });
		}
	});
</script>

<div class="mb-2 flex-auto items-center gap-x-4">
	<div class="rounded-xl px-4 py-2" style="background-color: #5d5d5d">
		<div class="h-40 overflow-y-scroll">
			{#each trip.stopTimes as stopTime, i}
				{@const wasPassed = i < trip.currentStopSequenceNumber}
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
						{#if i === trip.userStopSequenceNumber}
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
