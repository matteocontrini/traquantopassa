<script lang="ts">
	import { resolve } from '$app/paths';
	import type { FtmStation } from '$lib/server/ftm/FtmStation';
	import StationFavoriteButton from '$lib/components/StationFavoriteButton.svelte';

	interface Props {
		station: FtmStation;
	}

	let { station }: Props = $props();
</script>

<a
	href={resolve('/ftm/[station]', { station: station.slug })}
	class="flex w-full flex-col justify-between rounded-lg bg-neutral-800 px-4 pt-3 pb-4 no-underline"
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex flex-col gap-1">
			<span class="leading-snug" class:font-semibold={!station.requestOnly}>{station.name}</span>
			{#if station.requestOnly}
				<div class="text-sm text-neutral-400 italic">Fermata solo a richiesta</div>
			{/if}
			<span class="text-sm text-neutral-500 no-underline">
				/{station.slug}
			</span>
		</div>

		<StationFavoriteButton stationId={station.algorabId} className="pl-2 shrink-0" />
	</div>
</a>
