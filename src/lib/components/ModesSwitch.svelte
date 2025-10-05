<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		isBus?: boolean;
		stopSlug?: string;
		stationSlug?: string;
	}

	let { isBus = false, stopSlug, stationSlug }: Props = $props();

	let busLink = $derived(stopSlug
		? resolve('/[stop]', { stop: stopSlug })
		: resolve('/')
	);

	let trainLink = $derived(stationSlug
		? resolve('/treni/[station]', { station: stationSlug })
		: resolve('/treni')
	);
</script>

<div class="flex gap-2">
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={busLink}
		 class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
		 class:bg-neutral-100={isBus}
		 class:hover:bg-neutral-200={isBus}
		 class:text-neutral-800={isBus}
		 class:font-semibold={isBus}
		 class:bg-neutral-800={!isBus}
		 class:hover:bg-neutral-700={!isBus}>
		Autobus
	</a>

	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={trainLink}
		 class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
		 class:bg-neutral-100={!isBus}
		 class:hover:bg-neutral-200={!isBus}
		 class:text-neutral-800={!isBus}
		 class:font-semibold={!isBus}
		 class:bg-neutral-800={isBus}
		 class:hover:bg-neutral-700={isBus}>
		Treni
	</a>
</div>
