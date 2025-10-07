<script lang="ts">
	import type { FavoriteStops } from '$lib/storage/favorites.svelte';
	import { getContext } from 'svelte';
	import starFilled from '$lib/assets/star-filled.svg';
	import star from '$lib/assets/star.svg';
	import { onMount } from 'svelte';

	interface Props {
		stopCode: string;
		className?: string;
	}

	let { stopCode, className = '' }: Props = $props();

	const favorites: FavoriteStops = getContext('favorites');

	let isFavorite = $derived(favorites.value.includes(stopCode));
	let starElement: HTMLImageElement | undefined = $state();

	// On first page load (with ssr) the star is always empty
	// this forces an update to fix the UI
	onMount(() => {
		isFavorite = !isFavorite;
		isFavorite = !isFavorite;
	});

	function toggleFavorite(event: Event) {
		event.preventDefault();
		if (!isFavorite) {
			favorites.addFavorite(stopCode);
			starElement?.classList.add('animate-spin-forward');
		} else {
			favorites.removeFavorite(stopCode);
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
