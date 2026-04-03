<script lang="ts">
	import type { FtmTrain } from '$lib/server/ftm/FtmTrain';
	import { slide } from 'svelte/transition';
	import FtmTripDetail from './FtmTripDetail.svelte';
	import LiveTripAnimation from '$lib/components/LiveTripAnimation.svelte';
	import { Flag } from 'lucide-svelte';
	import type { ExpandedTripState } from '$lib/Trip';
	import { getContext } from 'svelte';
	import DepartingTrainAnimation from '$lib/components/DepartingTrainAnimation.svelte';

	interface Props {
		train: FtmTrain;
		userPosition: number;
	}

	let { train, userPosition }: Props = $props();

	let expandedTrip = getContext<ExpandedTripState>('expandedTrip');
	let expanded = $derived(expandedTrip.id === train.id);

	function toggle() {
		expandedTrip.id = expanded ? null : train.id;
	}
</script>

<div
	class="mb-2 flex cursor-pointer items-center gap-x-4"
	role="button"
	aria-expanded={expanded}
	onclick={() => toggle()}
	tabindex="0"
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ' ? toggle() : null)}
>
	<div
		class="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-neutral-600 text-lg font-semibold sm:w-20"
	>
		{train.time}
	</div>
	<div class="grow overflow-hidden whitespace-nowrap">
		<span
			class="flex items-center gap-x-2 overflow-hidden text-lg leading-tight text-ellipsis whitespace-nowrap"
			class:text-neutral-500={train.isEndOfRouteForUser}
			class:font-medium={!train.isEndOfRouteForUser}
		>
			{train.direction == 'Trento' ? '«' : '»'}
			{train.destination}
			{#if train.isEndOfRouteForUser}
				<Flag class="size-4" strokeWidth={2.5} />
			{/if}
		</span>
		<span class="block overflow-hidden text-xs text-ellipsis whitespace-nowrap text-neutral-500">
			{#if train.isBlinking}
				<span class="inline-block w-5">
					<DepartingTrainAnimation />
				</span>
			{/if}
			{#if train.position != null}
				Treno n.{train.number} • a {(Math.abs(train.position - userPosition) / 1000).toFixed(1)} km da
				te
			{/if}
			{#if train.delay === 0}
				• in orario
			{/if}
		</span>
	</div>
	{#if train.delay != null}
		{#if train.delay != 0}
			<div class="text-right text-xl font-semibold whitespace-nowrap text-red-600">
				+{train.delay}′
			</div>
		{/if}

		<LiveTripAnimation live={'green'} />
	{/if}
</div>
{#if expanded}
	<div transition:slide={{ duration: 300 }}>
		<FtmTripDetail {train}/>
	</div>
{/if}
