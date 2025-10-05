<script lang="ts">
	interface Props {
		minutes: number;
		dimmed: boolean;
	}

	let { minutes, dimmed }: Props = $props();

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

	function syncAnimation() {
		if (minutes != 0) {
			return;
		}
		// Get the first pulse animation that is already in progress
		const animations = document.getAnimations();
		const anim = animations.find(x => x instanceof CSSAnimation && x.animationName == 'pulse' && x.currentTime != 0);
		if (!anim) {
			return;
		}

		// Sync the current animation
		const elAnimation = animations.find(x => x.effect instanceof KeyframeEffect && x.effect.target == el);
		if (elAnimation) {
			elAnimation.currentTime = anim.currentTime;
		}
	}

	$effect(() => {
		syncAnimation();
	});
</script>

<div
	bind:this={el}
	class="text-right text-xl {dimmed ? 'font-medium' : 'font-semibold'} whitespace-nowrap"
	class:text-neutral-500={dimmed}
	class:animate-pulse={minutes === 0}
	class:text-red-600={!dimmed && minutes === 0}
>
	{ formatMinutes(minutes) }
</div>
