<script lang="ts">
	import { resolve } from '$app/paths';
	import { mapRouteIdsToRoutes } from '$lib/routes-helper';
	import type { StopGroup } from '$lib/StopGroup';
	import type { Route } from '$lib/Route';
	import StopFavoriteButton from '$lib/components/StopFavoriteButton.svelte';

	interface Props {
		stop: StopGroup;
		routes: Route[];
	}

	let { stop, routes }: Props = $props();
</script>

<a href={resolve('/[stop]', { stop: stop.slugs[0] })}
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
				class="w-7 h-7 shrink-0 flex justify-center items-center font-semibold text-base rounded-sm select-none {route.colorTxt}"
				style="background-color: {route.colorBG}"
			>
				{route.name}
			</div>
		{/each}
	</div>
</a>
