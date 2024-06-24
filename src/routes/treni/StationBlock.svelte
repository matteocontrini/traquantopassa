<script lang="ts">
	import type { Station } from '$lib/Station';
	import StationFavoriteButton from '$lib/components/StationFavoriteButton.svelte';

	export let station: Station;
</script>

<a href="/treni/{station.slug}"
	 class="w-full flex flex-col justify-between bg-neutral-800 rounded-lg px-4 pt-3 pb-4 no-underline"
>
	<div class="flex gap-2 justify-between items-start">
		<div class="flex flex-col gap-1">
			<span class="leading-snug">{station.name}</span>
			<span class="text-sm no-underline text-neutral-500">
				/{station.slug}
			</span>
		</div>

		<StationFavoriteButton stationId={station.id} className="pl-2 shrink-0" />
	</div>

	<div class="mt-2 text-xs font-semibold text-neutral-500 flex flex-col">
		{#each station.railways as railway (railway)}
			<span>{railway}</span>
		{/each}
	</div>
</a>
