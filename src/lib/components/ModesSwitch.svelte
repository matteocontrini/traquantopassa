<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		isBus?: boolean;
		stopSlug?: string;
		stationSlug?: string;
	}

	let { isBus = false, stopSlug, stationSlug }: Props = $props();
</script>

<div class="flex gap-2">
	<a
		href={stopSlug ? resolve('/[stop]', { stop: stopSlug }) : resolve('/')}
		class="flex h-8 cursor-pointer items-center rounded-md px-3 no-underline"
		class:bg-neutral-100={isBus}
		class:hover:bg-neutral-200={isBus}
		class:text-neutral-800={isBus}
		class:font-semibold={isBus}
		class:bg-neutral-800={!isBus}
		class:hover:bg-neutral-700={!isBus}
	>
		Autobus
	</a>

	<a
		href={stationSlug
			? resolve('/treni/[station]/[[departures]]', { station: stationSlug })
			: resolve('/treni')}
		class="flex h-8 cursor-pointer items-center rounded-md px-3 no-underline"
		class:bg-neutral-100={!isBus}
		class:hover:bg-neutral-200={!isBus}
		class:text-neutral-800={!isBus}
		class:font-semibold={!isBus}
		class:bg-neutral-800={isBus}
		class:hover:bg-neutral-700={isBus}
	>
		Treni
	</a>
</div>
