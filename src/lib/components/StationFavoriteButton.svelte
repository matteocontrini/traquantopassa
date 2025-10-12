<script lang="ts">
	import type { FavoriteStations } from '$lib/storage/favorites.svelte';
	import { getContext } from 'svelte';
	import starFilled from '$lib/assets/star-filled.svg';
	import star from '$lib/assets/star.svg';

	interface Props {
		stationId: string;
		className?: string;
	}

	let { stationId, className = '' }: Props = $props();

	const favorites: FavoriteStations = getContext('favorites');

	let isFavorite = $derived(favorites.value.includes(stationId));
	let starElement: HTMLImageElement | undefined = $state();

	function toggleFavorite(event: Event) {
		event.preventDefault();
		if (!isFavorite) {
			favorites.addFavorite(stationId);
			starElement?.classList.add('animate-spin-forward');
		} else {
			favorites.removeFavorite(stationId);
			starElement?.classList.add('animate-spin-backward');
		}
		starElement?.addEventListener('animationend', () => {
			starElement?.classList.remove('animate-spin-forward', 'animate-spin-backward');
		}, {
			once: true, // prevent memory leaks
		});
	}
</script>


<button class={className} onclick={toggleFavorite}>
	<img src={isFavorite ? starFilled : star}
			 alt={isFavorite ? 'Starred' : 'Unstarred'}
			 class="size-6"
			 bind:this={starElement} />
</button>
