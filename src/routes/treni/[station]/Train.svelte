<script lang="ts">
	import type { Train } from '$lib/Train';

	export let train: Train;
</script>

<div class="flex items-center gap-x-3 sm:gap-x-4 mb-2">
	<div
		class="h-10 w-16 sm:w-20 bg-neutral-600 flex-shrink-0 flex justify-center items-center font-semibold text-lg rounded-md"
	>
		{train.time}
	</div>
	<div class="flex-grow whitespace-nowrap overflow-hidden">
		<span class="block leading-tight text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
			{#if train.icon}
				{#await import(`$lib/assets/${train.icon}.svg`) then { default: src }}
					<img
						class="inline-block -mt-1 w-[22px] h-[22px]"
						{src}
						alt="{train.category}"
						title="{train.category}"
					/>
				{/await}
			{/if}
			{ train.destination }
		</span>
		<span class="block text-xs text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap">
			{#if train.isIncomplete}
				<span>⚠️ </span>
			{/if}
			{#if train.isBlinking}
				<span class="inline-block w-5">
						<span class="animate-blink block rounded-full w-2 h-2 bg-white"></span>
				</span>
			{/if}
			{#if train.isReplacedByBus}
				<span class="font-semibold text-orange-400">Sostituito da bus</span> •
			{/if}
			{#if train.platform}
				<span class="font-bold">Binario { train.platform }</span> •
			{/if}
			{ train.carrier } { train.number }
			{#if train.category && !train.icon}
				• { train.category }
			{/if}
		</span>
	</div>
	<div class="text-right font-semibold whitespace-nowrap text-red-600" class:text-xl={train.isDelayed}>
		{ train.delay }
	</div>
</div>
