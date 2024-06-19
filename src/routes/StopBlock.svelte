<script lang="ts">
	import { mapRouteIdsToRoutes } from '$lib/routes-helper';
	import type { StopGroup } from '$lib/StopGroup';
	import type { Route } from '$lib/Route';
	import star from '$lib/assets/star.svg';
	import starFilled from '$lib/assets/star-filled.svg';
	import { getContext } from 'svelte';
	import type { FavoritesStore } from '$lib/stores/favorites';

	export let stop: StopGroup;
	export let routes: Route[];
	export let isFavorite = false;

	const favorites: FavoritesStore = getContext('favorites');
	let starElement: HTMLImageElement;

	function toggleFavorite() {
		isFavorite = !isFavorite;
		if (isFavorite) {
			favorites.addFavorite(stop.code);
			starElement.classList.add('animate-spin-forward');
		} else {
			favorites.removeFavorite(stop.code);
			starElement.classList.add('animate-spin-backward');
		}
		starElement.addEventListener('animationend', () => {
			starElement.classList.remove('animate-spin-forward', 'animate-spin-backward');
		});
	}
</script>

<a href="/{stop.slugs[0]}"
	 class="w-full h-full bg-neutral-800 rounded-lg px-4 pt-2 pb-4 no-underline"
>
	<div class="flex gap-2 justify-between items-start">
		<div>
			{stop.name}
			<span class="block text-sm no-underline text-neutral-500">
				/{stop.slugs[0]}
			</span>
		</div>

		<button class="pt-2" on:click|preventDefault={toggleFavorite}>
			<img src={isFavorite ? starFilled : star} alt="star" class="size-6" bind:this={starElement} />
		</button>
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
