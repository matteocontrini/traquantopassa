<script lang="ts">
	import type { News } from '$lib/RouteNews';
	import StopBox from './StopBox.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		newsList: News[];
		today?: Date;
		ignoreDate?: boolean;
	}

	let showNews = $state(false);

	const onClick = (evt: Event) => {
		evt.preventDefault();
		showNews = !showNews;
	};

	let { newsList, today = new Date(), ignoreDate = false }: Props = $props();
</script>

<div class="flex gap-2">
	<button
		class="inline-flex h-8 grow basis-1/3 cursor-pointer items-center justify-center rounded-md px-3 py-5 leading-none no-underline"
		class:bg-neutral-100={showNews}
		class:hover:bg-neutral-200={showNews}
		class:text-neutral-800={showNews}
		class:font-semibold={showNews}
		class:bg-neutral-800={!showNews}
		class:hover:bg-neutral-700={!showNews}
		onclick={onClick}
	>
		{showNews ? 'Nascondi avvisi' : `🔔 Mostra avvisi`}
	</button>
</div>

{#if showNews}
	<div class="flex flex-col gap-2" transition:fade={{duration: 200}}>
		{#each newsList as news}
			{#if (today >= news.startDate && today <= news.endDate) || ignoreDate}
				<div class="rounded-lg bg-neutral-800 px-4 pt-3 pb-4 no-underline">
					<h2 class="mb-2 text-base leading-tight font-medium">⚠️ {news.title}</h2>
					<p class="mt-0 text-sm text-neutral-400">{news.details}</p>

					{#if news.routes.length}
						<div class="flex flex-wrap gap-2 pt-1">
							<p class="mt-0 size-full text-sm text-neutral-400">Linee interessate:</p>

							{#each news.routes as route}
								<StopBox 
									name={route.name}
									colorBG={route.colorBG}
									colorTxt={route.colorTxt}
									size="small"
								/>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}
