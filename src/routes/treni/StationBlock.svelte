<script lang="ts">
	import type { Station } from '$lib/Station';
	import star from '$lib/assets/star.svg';
	import starFilled from '$lib/assets/star-filled.svg';
	import { getContext } from 'svelte';
	import type { FavoritesStore } from '$lib/stores/stations-favorites';

	export let station: Station;
	export let isFavorite = false;

	const favorites: FavoritesStore = getContext('favorites');
	let starElement: HTMLImageElement;

	function toggleFavorite() {
		isFavorite = !isFavorite;
		if (isFavorite) {
			favorites.addFavorite(station.id);
			starElement.classList.add('animate-spin-forward');
		} else {
			favorites.removeFavorite(station.id);
			starElement.classList.add('animate-spin-backward');
		}
		starElement.addEventListener('animationend', () => {
			starElement.classList.remove('animate-spin-forward', 'animate-spin-backward');
		});
	}
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

		<button class="pl-2 shrink-0" on:click|preventDefault={toggleFavorite}>
			<img src={isFavorite ? starFilled : star} alt="star" class="size-6" bind:this={starElement} />
		</button>
	</div>

	<div class="mt-2 text-xs font-semibold text-neutral-500 flex flex-col">
		{#each station.railways as railway (railway)}
			<span>{railway}</span>
		{/each}
	</div>
</a>
