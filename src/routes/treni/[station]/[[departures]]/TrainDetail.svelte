<script lang="ts">
	import type { Train } from '$lib/Train';

	interface Props {
		train: Train;
	}

	let { train }: Props = $props();

</script>

<!-- This wrapper is needed to be able to add a bottom padding and avoid the slide transition jerkiness -->
<div class="pt-1 pb-3">
	<div class="rounded-lg bg-neutral-800 border border-neutral-700">
		<div class="max-h-40 py-3 overflow-y-auto px-4 flex flex-col gap-y-2.5">
			{#if train.notes}
				<div class="leading-[1.3]">
					<h3 class="inline font-medium text-neutral-400">
						Informazioni:
					</h3>
					<p class="inline m-0">
						{train.notes}
					</p>
				</div>
			{/if}
			{#if train.stopTimes.length}
				<h3 class="font-medium text-neutral-400 leading-none mb-1">
					Ferma a:
				</h3>
				<!-- eslint-disable-next-line svelte/require-each-key -->
				{#each train.stopTimes as stopTime}
					<div class="flex items-center gap-x-4">
						<div class="w-10 leading-none font-semibold">
							{stopTime.time}
						</div>

						<div class="whitespace-nowrap leading-none">
							{stopTime.name}
						</div>
					</div>
				{/each}
			{/if}
			{#if !train.notes && !train.stopTimes.length}
				<div class="text-center">
					Nessuna informazione disponibile per
					questo {train.category === 'Bus' || train.isReplacedByBus ? 'autobus' : 'treno'}
				</div>
			{/if}
		</div>
	</div>
</div>
