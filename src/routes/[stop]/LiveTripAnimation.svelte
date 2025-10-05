<script lang="ts">
	interface Props {
		live: 'green' | 'yellow' | null;
		className?: string;
	}

	let { live, className = '' }: Props = $props();

	let el: HTMLSpanElement;

	function syncAnimation() {
		if (!live) {
			return;
		}

		// Get the first ping animation that is already in progress
		const animations = document.getAnimations();
		const anim = animations.find(x => x instanceof CSSAnimation && x.animationName == 'ping' && x.currentTime != 0);
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

<span
	bind:this={el}
	class="rounded-full w-2 h-2 {className}"
	class:bg-green-500={live === 'green'}
	class:bg-yellow-500={live === 'yellow'}
	class:animate-ping={live != null}
></span>
