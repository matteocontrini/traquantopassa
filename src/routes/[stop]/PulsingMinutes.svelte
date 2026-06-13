<script lang="ts">
	interface Props {
		minutes: number;
		dimmed: boolean;
		arrivalTime?: string;
		isFutureSearch: boolean;
	}

	let { minutes, dimmed, arrivalTime, isFutureSearch = false }: Props = $props();

	let el: HTMLDivElement;

	function formatMinutes(minutes: number) {
		if (minutes < 60) {
			return `${minutes}′`;
		} else {
			let hours = Math.floor(minutes / 60);
			let minutesLeft = minutes % 60;
			if (minutesLeft === 0) {
				return `${hours}h`;
			} else {
				return `${hours}h ${minutesLeft}m`;
			}
		}
	}

	let arrivalTimeDerived = $derived.by(() => {
		if (arrivalTime) return arrivalTime.substring(0, 5);

		const date = new Date();
		date.setMinutes(date.getMinutes() + minutes);
		return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
	});

	function syncAnimation() {
		el.getAnimations().forEach((a) => (a.startTime = 0));
	}

	$effect(() => {
		syncAnimation();
	});
</script>

<div class="flex flex-col items-end justify-center">
 	{#if isFutureSearch}
		<div class="text-right text-xl font-semibold text-white whitespace-nowrap">
			{arrivalTimeDerived}
		</div>
	{:else}
		<div
			bind:this={el}
			onanimationstart={syncAnimation}
			class="text-right text-xl {dimmed ? 'font-medium' : 'font-semibold'} whitespace-nowrap"
			class:text-neutral-500={dimmed}
			class:animate-pulse={minutes === 0}
			class:text-red-600={!dimmed && minutes === 0}
		>
			{formatMinutes(minutes)}
		</div>
		<div class="text-xs text-neutral-500">
			{arrivalTimeDerived}
		</div>
	{/if}
</div>