<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		isDeparture?: boolean;
		stationSlug?: string;
	}

	let { isDeparture = true, stationSlug }: Props = $props();

	let arrivalsLink = $derived(stationSlug
		? resolve('/treni/[station]/arrivi', { station: stationSlug })
		: resolve('/')
	);

	let departuresLink = $derived(stationSlug
		? resolve('/treni/[station]', { station: stationSlug })
		: resolve('/')
	);



</script>

<div class="flex gap-2">
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->

	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={departuresLink}
		 class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
		 class:bg-neutral-100={isDeparture}
		 class:hover:bg-neutral-200={isDeparture}
		 class:text-neutral-800={isDeparture}
		 class:font-semibold={isDeparture}
		 class:bg-neutral-800={!isDeparture}
		 class:hover:bg-neutral-700={!isDeparture}>
		Partenze
	</a>

	<a href={arrivalsLink}
		 class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
		 class:bg-neutral-100={!isDeparture}
		 class:hover:bg-neutral-200={!isDeparture}
		 class:text-neutral-800={!isDeparture}
		 class:font-semibold={!isDeparture}
		 class:bg-neutral-800={isDeparture}
		 class:hover:bg-neutral-700={isDeparture}>
		Arrivi
	</a>
</div>
