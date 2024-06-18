<script lang="ts">
	import { mapRouteIdsToRoutes } from '$lib/routes-helper';

	export let data;
</script>

<header>
	<h1 class="font-semibold text-4xl">Tra quanto passa in...</h1>
	<div class="mt-2 text-neutral-500 text-lg">Città di Trento</div>
</header>

<div class="mt-10 text-lg grid sm:grid-cols-2 gap-4">
	{#each data.stops as stop (stop.slugs[0])}
		<a href="/{stop.slugs[0]}"
			 class="bg-neutral-800 rounded-lg px-4 pt-2 pb-4 no-underline">
			{stop.name}
			<span class="block text-sm no-underline text-neutral-500">
				/{stop.slugs[0]}
			</span>
			<div class="mt-4 flex gap-2 flex-wrap">
				{#each mapRouteIdsToRoutes(stop.routeIds, data.routes) as route (route.id)}
					<div
						class="w-7 h-7 flex-shrink-0 flex justify-center items-center font-semibold text-base rounded select-none"
						style="background-color: {route.color}"
					>
						{route.name}
					</div>
				{/each}
			</div>
		</a>
	{/each}
</div>
