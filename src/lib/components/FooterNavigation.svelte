<script lang="ts">
	export let className: string;
	export let isBus: boolean = true;
</script>

<div class="flex gap-2 flex-wrap {className}">
	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/">
		🚍 Lista fermate autobus
	</a>

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/treni">
		🚆 Lista stazioni treni
	</a>

	{#if isBus}
		<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/aiuto">
			❓ Istruzioni per trovare le fermate
		</a>
	{/if}

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
		ℹ️ Informazioni
	</a>
</div>
