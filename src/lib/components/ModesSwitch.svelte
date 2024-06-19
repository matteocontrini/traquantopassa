<script lang="ts">
	export let isBus = false;
	export let busSlug = '';
	export let trainSlug = '';
</script>

<div class="flex gap-2">
	<a href="/{busSlug}"
		 class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
		 class:bg-neutral-100={isBus}
		 class:hover:bg-neutral-200={isBus}
		 class:text-neutral-800={isBus}
		 class:font-semibold={isBus}
		 class:bg-neutral-800={!isBus}
		 class:hover:bg-neutral-700={!isBus}>
		Autobus
	</a>
	<a href="/treni/{trainSlug}"
		 class="h-8 px-3 flex items-center rounded-md no-underline cursor-pointer"
		 class:bg-neutral-100={!isBus}
		 class:hover:bg-neutral-200={!isBus}
		 class:text-neutral-800={!isBus}
		 class:font-semibold={!isBus}
		 class:bg-neutral-800={isBus}
		 class:hover:bg-neutral-700={isBus}>
		Treni
	</a>
</div>
