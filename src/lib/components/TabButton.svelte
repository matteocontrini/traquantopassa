<script lang="ts">
	interface Props {
		text: string;
		isSelected: boolean;
		onClick: () => void;
	}

	let { text, isSelected, onClick }: Props = $props();
</script>

<button
	class="h-8 px-3 py-5 inline-flex items-center justify-center rounded-md no-underline cursor-pointer leading-none basis-1/3 flex-grow"
	class:bg-neutral-100={isSelected}
	class:hover:bg-neutral-200={isSelected}
	class:text-neutral-800={isSelected}
	class:font-semibold={isSelected}
	class:bg-neutral-800={!isSelected}
	class:hover:bg-neutral-700={!isSelected}
	onclick={onClick}
>
	{text}
</button>
