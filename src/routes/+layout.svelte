<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import { navigating } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import type { Topbar } from 'topbar';
	import { createFavoritesStore } from '$lib/stores/stops-favorites';

	let topbar: Topbar;
	onMount(async () => {
		topbar = await import('topbar') as unknown as Topbar;
		topbar.config({
			barColors: {
				'0': '#ffffff'
			}
		});
	});

	$: {
		if ($navigating) {
			topbar?.show();
		} else {
			topbar?.hide();
		}
	}

	setContext('favorites', createFavoritesStore());
</script>

<div class="max-w-[600px] mx-auto mt-10 px-5">
	<slot></slot>
</div>
