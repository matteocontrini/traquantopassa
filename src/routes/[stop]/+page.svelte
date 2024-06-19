<script lang="ts">
	import type { StopGroupDetails } from '$lib/StopGroupDetails';

	export let data;

	const details: StopGroupDetails = data.details;
</script>

<header>
	<h1 class="font-semibold text-center text-4xl">{ details.name }</h1>
	<div class="mt-1 text-sm text-center">
		aggiornato alle
		{
			new Date(details.lastUpdatedAt).toLocaleTimeString(['it-IT'], {
				hour: '2-digit',
				minute: '2-digit',
			})
		}
	</div>

	<!-- TODO: train switch -->
</header>
