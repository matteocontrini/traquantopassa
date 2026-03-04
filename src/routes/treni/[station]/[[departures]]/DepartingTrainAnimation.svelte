<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLSpanElement | undefined = $state();

	onMount(() => {
		// Get the first train animation that is already in progress
		const animations = document.getAnimations();
		const anim = animations.find(x => x instanceof CSSAnimation && x.animationName == 'train' && x.currentTime != 0);
		if (!anim) {
			return;
		}

		// Sync the current animation
		const elAnimation = animations.find(x => x.effect instanceof KeyframeEffect && x.effect.target == el);
		if (elAnimation) {
			elAnimation.currentTime = anim.currentTime;
		}
	});
</script>

<span bind:this={el} class="animate-train block rounded-full w-2 h-2 bg-white"></span>
