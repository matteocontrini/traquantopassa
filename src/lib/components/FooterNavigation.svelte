<script lang="ts">
	export let className: string;
</script>

<div class="flex gap-2 flex-wrap {className}">
	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/">
		🚍 Lista fermate autobus
	</a>

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/treni">
		🚆 Lista stazioni treni
	</a>

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/aiuto">
		❓ Istruzioni per trovare le fermate
	</a>

	<a class="px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
		ℹ️ Informazioni
	</a>
</div>
