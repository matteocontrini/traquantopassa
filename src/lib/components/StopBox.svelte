<script lang="ts">
	interface Props {
		name: string;
		colorBG: string;
		colorTxt: string;
		size: 'big' | 'small';
	}

	let { name, colorBG, colorTxt, size }: Props = $props();

	let classes: string = `shrink-0 flex justify-center items-center select-none ${colorTxt}`;

	if (size === 'small') {
		classes += 'w-7 h-7 font-semibold text-base rounded-sm';
	} else if (size === 'big') {
		classes += 'w-10 h-10 font-bold text-xl rounded-md';
	}
</script>

<div class={classes} style="background-color: {colorBG}">
	{name}
</div>
