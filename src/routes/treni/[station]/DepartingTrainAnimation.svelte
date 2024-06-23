<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLSpanElement;

	onMount(() => {
		// Get the first train animation that isn't the one we're animating
		const animations = document.getAnimations();
		const anim = animations.find(x => x.animationName == 'train' && x.effect?.target != el);
		if (!anim) {
			return;
		}
		// Sync the current animation
		const elAnimation = animations.find(x => x.effect?.target == el);
		if (elAnimation) {
			elAnimation.currentTime = anim.currentTime;
		}
	});
</script>

<span bind:this={el} class="animate-train block rounded-full w-2 h-2 bg-white"></span>
