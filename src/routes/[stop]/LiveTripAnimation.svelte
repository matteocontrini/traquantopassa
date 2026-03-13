<script lang="ts">
	interface Props {
		live: 'green' | 'yellow' | null;
		className?: string;
	}

	let { live, className = '' }: Props = $props();

	let el: HTMLSpanElement;

	function syncAnimation() {
		el.getAnimations().forEach((a) => (a.startTime = 0));
	}

	$effect(() => {
		syncAnimation();
	});
</script>

<span
	bind:this={el}
	onanimationstart={syncAnimation}
	class="rounded-full w-2 h-2 {className}"
	class:bg-green-500={live === 'green'}
	class:bg-yellow-500={live === 'yellow'}
	class:animate-ping={live != null}
></span>
