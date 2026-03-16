<script lang="ts">
	import type { FtmTrain } from '$lib/server/ftm/FtmTrain';
	import { onMount } from 'svelte';

	interface Props {
		train: FtmTrain;
	}

	const stopElements: (HTMLDivElement | undefined)[] = $state([]);

	onMount(() => {
		// On load, show the last passed stop in the middle so it's easier to see.
		// In case no live data is available, just have the current stop in the middle.
		const stopNumber = train.delay === null ? train.userStopSequenceNumber : train.currentStopSequenceNumber;
		const elementToScroll = stopElements[stopNumber - 1];
		if (elementToScroll) {
			elementToScroll.scrollIntoView({ block: 'center' });
		}
	});

	let { train }: Props = $props();
</script>

<!-- This wrapper is needed to be able to add a bottom padding and avoid the slide transition jerkiness -->
<div class="pt-1 pb-3">
	<div class="rounded-lg border border-neutral-700 bg-neutral-800">
		<div class="flex max-h-40 flex-col gap-y-2.5 overflow-y-auto px-4 py-3">
			<!-- img src = "http://trainview.algorab.net/img/trenino180.gif" class="w-20 pl-12" alt="Posizione treno"-->
			{#each train.stopTimes as stopTime, i}
				{@const wasPassed = i < train.currentStopSequenceNumber}
				<div bind:this={stopElements[i]} class="flex items-center gap-x-4">
					<div class="w-10 leading-none font-semibold">
						{stopTime.time}
					</div>
					<div class="relative flex flex-col items-center">
						{#if stopTime.requestOnly && wasPassed}
								<!-- Show the "-" on request only stations-->
								<div class="pl-2">
									<div class="h-1.5 w-2 bg-neutral-100"></div>
								</div>
						{:else}
							<!-- Show the circle on stations-->
							<span
								class="relative z-10 size-4 rounded-full {wasPassed
									? 'bg-neutral-100'
									: 'border-[1.5px] border-neutral-100 bg-neutral-700'}"
							></span>
						{/if}
						{#if wasPassed}
							<div
								class="absolute top-1 h-8.5 w-1.5 bg-neutral-100"
							></div>
						{/if}
					</div>
					<div class="leading-none whitespace-nowrap">
						{#if i == train.userStopSequenceNumber}
							<span class="font-bold">La tua stazione 📍</span>
						{:else}
							<span class:text-neutral-500={stopTime.requestOnly}>{stopTime.name}</span>
							{#if stopTime.requestOnly}
								<span class="italic text-neutral-600 text-sm">(Solo a richiesta)</span>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
