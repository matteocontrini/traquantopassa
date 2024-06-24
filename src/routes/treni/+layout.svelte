<script lang="ts">
	import { setContext } from 'svelte';
	import { createFavoritesStore } from '$lib/stores/stations-favorites';

	setContext('favorites', createFavoritesStore());
</script>

<slot></slot>
