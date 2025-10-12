<script lang="ts">
	import type { Trip, ExpandedTripState } from '$lib/Trip';
	import LiveTripAnimation from './LiveTripAnimation.svelte';
	import PulsingMinutes from './PulsingMinutes.svelte';
	import { Flag } from 'lucide-svelte';
	import BusTripDetail from './BusTripDetail.svelte';
	import { slide } from 'svelte/transition';
	import { getContext } from 'svelte';
	import StopBox from '$lib/components/StopBox.svelte';

	interface Props {
		trip: Trip;
	}

	let { trip }: Props = $props();

	let expandedTrip = getContext<ExpandedTripState>('expandedTrip');
	let expanded = $derived(expandedTrip.id === trip.id);

	function toggle() {
		expandedTrip.id = expanded ? null : trip.id;
	}
</script>

<div class="flex items-center gap-x-4 mb-2 cursor-pointer"
		 role="button" aria-expanded={expanded}
		 onclick={() => toggle()} tabindex="0"
		 onkeydown={(e) => (e.key === 'Enter' || e.key === ' ' ? toggle() : null)}
>
	<StopBox 
		name={trip.routeName}
		colorBG={trip.routeColor}
		colorTxt={trip.colorTxt}
		size="big"
	/>
	<div class="grow whitespace-nowrap overflow-hidden">
		<span
			class="flex gap-x-2 items-center leading-tight text-lg text-ellipsis overflow-hidden whitespace-nowrap"
			class:text-neutral-500={trip.isEndOfRouteForUser}
			class:font-medium={!trip.isEndOfRouteForUser}>
			{trip.destination}
			{#if trip.isEndOfRouteForUser}
				<Flag class="size-4" strokeWidth={2.5} />
			{/if}
		</span>
		<span class="block leading-none text-xs text-neutral-500">
			{#if trip.delay != null}
				{@const distanceInStops = trip.userStopSequenceNumber - trip.currentStopSequenceNumber}

				{#if trip.currentStopSequenceNumber === 0}
					non ancora partito
				{:else if distanceInStops < 0}
					oltre la tua fermata
				{:else if distanceInStops === 0}
					alla tua fermata
				{:else if distanceInStops === 1}
					a 1 fermata da te
				{:else}
					a {distanceInStops} fermate da te
				{/if}
				{#if trip.currentStopSequenceNumber === 1}
					(1ª fermata)
				{/if}

				•

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
	<PulsingMinutes minutes={trip.minutes} dimmed={trip.isEndOfRouteForUser} />
	<LiveTripAnimation live={trip.delay != null ? (trip.isOutdated ? 'yellow' : 'green') : null} />
</div>

{#if expanded}
	<div transition:slide={{ duration: 300}}>
		<BusTripDetail {trip} />
	</div>
{/if}
