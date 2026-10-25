<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { favoriteStationsStore } from '#lib/storage/favorites.svelte.js';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	setContext('favorites', favoriteStationsStore());
</script>

{@render children?.()}
