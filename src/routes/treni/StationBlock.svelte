<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Station } from '#lib/Station.js';
	import StationFavoriteButton from '#lib/components/StationFavoriteButton.svelte';

	interface Props {
		station: Station;
	}

	let { station }: Props = $props();
</script>

<a
	href={resolve('/treni/[station]/[[departures]]', { station: station.slug })}
	class="flex w-full flex-col justify-between rounded-lg bg-neutral-800 px-4 pt-3 pb-4 no-underline"
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex flex-col gap-1">
			<span class="leading-snug">{station.name}</span>
			<span class="text-sm text-neutral-500 no-underline">
				/{station.slug}
			</span>
		</div>

		<StationFavoriteButton stationId={station.id} className="pl-2 shrink-0" />
	</div>

	<div class="mt-2 flex flex-col text-xs font-semibold text-neutral-500">
		{#each station.railways as railway (railway)}
			<span>{railway}</span>
		{/each}
	</div>
</a>
