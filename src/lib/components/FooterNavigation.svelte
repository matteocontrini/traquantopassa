<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		className: string;
		isBus?: boolean;
	}

	let { className, isBus = true }: Props = $props();
</script>

<div class="flex gap-2 flex-wrap {className}">
	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href={resolve('/')}>
		🚍 Fermate autobus
	</a>

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href={resolve('/treni')}>
		🚆 Stazioni treni
	</a>

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href={resolve('/ftm')}>
		🚉 Stazioni FTM
	</a>

	{#if isBus}
		<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href={resolve('/aiuto')}>
			❓ Istruzioni per trovare le fermate
		</a>
	{/if}

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href={resolve('/info')}>
		ℹ️ Informazioni
	</a>
</div>
