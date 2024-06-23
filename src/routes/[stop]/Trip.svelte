<script lang="ts">
	import type { Trip } from '$lib/Trip';
	import LiveTripAnimation from './LiveTripAnimation.svelte';
	import PulsingMinutes from './PulsingMinutes.svelte';

	export let trip: Trip;
</script>

<div class="flex items-center gap-x-4 mb-2">
	<div
		class="w-10 h-10 flex-shrink-0 flex justify-center items-center font-bold text-xl rounded-md select-none"
		style="background-color: {trip.routeColor}"
	>
		{trip.routeName}
	</div>
	<div class="flex-grow whitespace-nowrap overflow-hidden">
		<span class="block leading-tight text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
				{trip.destination}
		</span>
		<span class="block leading-none text-xs text-neutral-500">
			{#if trip.distanceInStops != null}
				{#if trip.distanceInStops === -2}
					oltre la tua fermata
				{:else if trip.distanceInStops === -1}
					non ancora partito
				{:else if trip.distanceInStops === 0}
					alla tua fermata
				{:else if trip.distanceInStops === 1}
					a {trip.distanceInStops} fermata da te
				{:else}
					a {trip.distanceInStops} fermate da te
				{/if}
				{#if trip.delay != null} •{/if}
			{/if}
			{#if trip.delay != null}
				{#if trip.delay === 0}
					in orario
				{:else if trip.delay > 0}
					in ritardo di {trip.delay} min
				{:else}
					in anticipo di {-trip.delay} min
				{/if}
			{/if}
		</span>
	</div>
	<PulsingMinutes minutes={trip.minutes} />
	<LiveTripAnimation green={trip.delay != null && !trip.isOutdated}
										 yellow={trip.delay != null && trip.isOutdated} />
</div>
