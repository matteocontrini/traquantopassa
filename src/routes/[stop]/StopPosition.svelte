<script lang="ts">
	import type { StopTime } from '$lib/Trip';

	export let stopTime: StopTime;
	export let color: string;
	export let wasPassed: boolean;
</script>

<div class="mb-2 flex items-center gap-x-4">
	<span class="text-white-500 block w-10 text-center leading-none">
		<b>{stopTime.time}</b>
	</span>

	<div class="relative flex flex-col items-center">
		<div
			class="relative z-10 h-4 w-4 rounded-full border-black"
			class:border-2={wasPassed}
			style:background-color={wasPassed ? color : '#f1f1f1'}
		/>
		
		<!-- it shouldn't protrude below because the trip is eliminated once it reaches the end of its route -->
		{#if wasPassed}
			<div class="absolute top-4 h-4 w-1.5" style:background-color={color} />
		{/if}
	</div>

	<span class="text-white-1000 block whitespace-nowrap leading-none">
		{#if stopTime.name === '$current_stop'}
			<strong class = "text-outline">La tua fermata 📍</strong>
		{:else}
			{stopTime.name}
		{/if}
	</span>
</div>
