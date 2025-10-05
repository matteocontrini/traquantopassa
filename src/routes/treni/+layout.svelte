<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { createFavoritesStore } from '$lib/stores/stations-favorites';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	setContext('favorites', createFavoritesStore());
</script>

{@render children?.()}
