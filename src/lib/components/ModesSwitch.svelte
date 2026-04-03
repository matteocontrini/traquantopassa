<script lang="ts">
	import { resolve } from '$app/paths';
	import type { StopConnections } from '$lib/server/stops-stations-mapping';

	interface Props {
		selectedTab: 'bus' | 'train' | 'ftm';
		connections?: StopConnections;
	}

	let { selectedTab, connections}: Props = $props();

	let isBus = $derived(selectedTab == 'bus');
	let isTrain = $derived(selectedTab == 'train');
	let isFtm = $derived(selectedTab == 'ftm');

	let busLink = $derived(
		connections?.bus ? resolve('/[stop]', { stop: connections.bus }) : resolve('/')
	);

	let trainLink = $derived(
		connections?.train ? resolve('/treni/[station]', { station: connections.train }) : resolve('/treni')
	);

	let ftmLink = $derived(
		connections?.ftm ? resolve('/ftm/[station]', { station: connections.ftm }) : resolve('/ftm')
	);
</script>

<div class="flex gap-2">
	{#if !connections || connections.bus}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a
			href={busLink}
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
	{/if}

	{#if !connections || connections.train}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a
			href={trainLink}
			class="flex h-8 cursor-pointer items-center rounded-md px-3 no-underline"
			class:bg-neutral-100={isTrain}
			class:hover:bg-neutral-200={isTrain}
			class:text-neutral-800={isTrain}
			class:font-semibold={isTrain}
			class:bg-neutral-800={!isTrain}
			class:hover:bg-neutral-700={!isTrain}
		>
			Treni
		</a>
	{/if}

	{#if !connections || connections.ftm}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a
			href={ftmLink}
			class="flex h-8 cursor-pointer items-center rounded-md px-3 no-underline"
			class:bg-neutral-100={isFtm}
			class:hover:bg-neutral-200={isFtm}
			class:text-neutral-800={isFtm}
			class:font-semibold={isFtm}
			class:bg-neutral-800={!isFtm}
			class:hover:bg-neutral-700={!isFtm}
		>
			FTM
		</a>
	{/if}
</div>
