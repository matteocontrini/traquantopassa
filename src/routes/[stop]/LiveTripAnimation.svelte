<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let live: 'green' | 'yellow' | null;
	export let className: string = '';

	let el: HTMLSpanElement;

	function syncAnimation() {
		if (!live) {
			return;
		}

		// Get the first ping animation that is already in progress
		const animations = document.getAnimations();
		const anim = animations.find(x => x.animationName == 'ping' && x.currentTime != 0);
		if (!anim) {
			return;
		}

		// Sync the current animation
		const elAnimation = animations.find(x => x.effect?.target == el);
		if (elAnimation) {
			elAnimation.currentTime = anim.currentTime;
		}
	}

	afterUpdate(() => {
		syncAnimation();
	});
</script>

<span
	bind:this={el}
	class="rounded-full w-2 h-2 animate-ping {className}"
	class:bg-green-500={live === 'green'}
	class:bg-yellow-500={live === 'yellow'}
	class:animate-ping={live != null}
></span>
