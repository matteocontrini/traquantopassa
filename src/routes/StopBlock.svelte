<script lang="ts">
	import { mapRouteIdsToRoutes } from '$lib/routes-helper';
	import type { StopGroup } from '$lib/StopGroup';
	import type { Route } from '$lib/Route';
	import StopFavoriteButton from '$lib/components/StopFavoriteButton.svelte';

	export let stop: StopGroup;
	export let routes: Route[];
</script>

<a href="/{stop.slugs[0]}"
	 class="w-full h-full bg-neutral-800 rounded-lg px-4 pt-3 pb-4 no-underline"
>
	<div class="flex gap-2 justify-between items-start">
		<div class="flex flex-col gap-1">
			<span class="leading-snug">{stop.name}</span>
			<span class="text-sm no-underline text-neutral-500">
				/{stop.slugs[0]}
			</span>
		</div>

		<StopFavoriteButton stopCode={stop.code} className="pl-2 shrink-0" />
	</div>
	<div class="mt-4 flex gap-2 flex-wrap">
		{#each mapRouteIdsToRoutes(stop.routeIds, routes) as route (route.id)}
			<div
				class="w-7 h-7 flex-shrink-0 flex justify-center items-center font-semibold text-base rounded select-none"
				style="background-color: {route.color}"
			>
				{route.name}
			</div>
		{/each}
	</div>
</a>
