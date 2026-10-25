<script lang="ts">
	import '#lib/polyfills.js';
	import '@fontsource-variable/inter/index.css';
	import '../app.css';
	import { navigating } from '$app/state';
	import { onMount, setContext, type Snippet } from 'svelte';
	import type { Topbar } from 'topbar';
	import { favoriteStopsStore } from '#lib/storage/favorites.svelte.js';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let topbar: Topbar | undefined = $state();

	onMount(async () => {
		topbar = (await import('topbar')) as unknown as Topbar;
		topbar.config({
			barColors: {
				'0': '#ffffff',
			},
		});
	});

	$effect(() => {
		if (navigating.to) {
			topbar?.show(150);
		} else {
			topbar?.hide();
		}
	});

	setContext('favorites', favoriteStopsStore());
</script>

<!--<Banner />-->

<div class="mx-auto mt-10 max-w-[600px] px-5">
	{@render children?.()}
</div>
