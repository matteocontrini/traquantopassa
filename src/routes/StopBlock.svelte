<script lang="ts">
	import { mapRouteIdsToRoutes } from '$lib/routes-helper';
	import type { StopGroup } from '$lib/StopGroup';
	import type { Route } from '$lib/Route';

	export let stop: StopGroup;
	export let routes: Route[];
</script>

<a href="/{stop.slugs[0]}"
	 class="w-full h-full bg-neutral-800 rounded-lg px-4 pt-2 pb-4 no-underline"
>
	{stop.name}
	<span class="block text-sm no-underline text-neutral-500">
		/{stop.slugs[0]}
	</span>
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
