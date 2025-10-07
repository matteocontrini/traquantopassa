<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import { navigating } from '$app/state';
	import { onMount, setContext, type Snippet } from 'svelte';
	import type { Topbar } from 'topbar';
	import { favoriteStopsStore } from '$lib/storage/favorites.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let topbar: Topbar | undefined = $state();

	onMount(async () => {
		topbar = await import('topbar') as unknown as Topbar;
		topbar.config({
			barColors: {
				'0': '#ffffff'
			}
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

<div class="max-w-[600px] mx-auto mt-10 px-5">
	{@render children?.()}
</div>
