<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		isDeparture?: boolean;
		stationSlug?: string;
	}

	let { isDeparture = true, stationSlug }: Props = $props();
</script>

<div class="flex gap-2">
	<a
		href={stationSlug
			? resolve('/treni/[station]/[[departures]]', { station: stationSlug })
			: resolve('/')}
		class="flex h-8 cursor-pointer items-center rounded-md px-3 no-underline"
		class:bg-neutral-100={isDeparture}
		class:hover:bg-neutral-200={isDeparture}
		class:text-neutral-800={isDeparture}
		class:font-semibold={isDeparture}
		class:bg-neutral-800={!isDeparture}
		class:hover:bg-neutral-700={!isDeparture}
	>
		Partenze
	</a>

	<a
		href={stationSlug
			? resolve('/treni/[station]/[[departures]]', { station: stationSlug, departures: 'arrivi' })
			: resolve('/')}
		class="flex h-8 cursor-pointer items-center rounded-md px-3 no-underline"
		class:bg-neutral-100={!isDeparture}
		class:hover:bg-neutral-200={!isDeparture}
		class:text-neutral-800={!isDeparture}
		class:font-semibold={!isDeparture}
		class:bg-neutral-800={isDeparture}
		class:hover:bg-neutral-700={isDeparture}
	>
		Arrivi
	</a>
</div>
