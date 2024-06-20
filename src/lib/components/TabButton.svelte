<script lang="ts">
	export let text: string;
	export let isSelected: boolean;
	export let onClick: () => void;
</script>

<button
	class="h-8 px-3 py-5 inline-flex items-center justify-center rounded-md no-underline cursor-pointer leading-none basis-1/3 flex-grow"
	class:bg-neutral-100={isSelected}
	class:hover:bg-neutral-200={isSelected}
	class:text-neutral-800={isSelected}
	class:font-semibold={isSelected}
	class:bg-neutral-800={!isSelected}
	class:hover:bg-neutral-700={!isSelected}
	on:click={onClick}
>
	{text}
</button>
