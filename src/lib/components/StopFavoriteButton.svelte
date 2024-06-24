<script lang="ts">
	import type { FavoritesStore } from '$lib/stores/stops-favorites';
	import { getContext } from 'svelte';
	import starFilled from '$lib/assets/star-filled.svg';
	import star from '$lib/assets/star.svg';

	export let stopCode: string;
	export let className = '';

	const favorites: FavoritesStore = getContext('favorites');

	let isFavorite = $favorites.has(stopCode);
	let starElement: HTMLImageElement;

	function toggleFavorite() {
		isFavorite = !isFavorite;
		if (isFavorite) {
			favorites.addFavorite(stopCode);
			starElement.classList.add('animate-spin-forward');
		} else {
			favorites.removeFavorite(stopCode);
			starElement.classList.add('animate-spin-backward');
		}
		starElement.addEventListener('animationend', () => {
			starElement.classList.remove('animate-spin-forward', 'animate-spin-backward');
		});
	}
</script>


<button class={className} on:click|preventDefault={toggleFavorite}>
	<img src={isFavorite ? starFilled : star} alt="star" class="size-6" bind:this={starElement} />
</button>
