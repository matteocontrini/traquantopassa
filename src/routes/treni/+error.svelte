<script lang="ts">
	import { page } from '$app/state';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
</script>

<div class="text-center mt-12">
	<div class="text-red-500">
		{#if page.status === 404}
			<p>Stazione ferroviaria non trovata</p>
			<p>
				Puoi chiedere che venga aggiunta
				<a href="mailto:ciao@traquantopassa.in?subject=Richiesta stazione /{page.params.station}">via email</a>.
			</p>
		{:else if page.status === 503}
			<p>I dati di RFI non sono al momento disponibili 😕</p>
			<p>Prova a ricaricare la pagina.</p>
			<p>
				Se il problema persiste, contattaci
				<a href="mailto:ciao@traquantopassa.in">via email</a>.
			</p>
		{:else}
			<p>Si è verificato un errore 😕</p>
			<p>Prova a ricaricare la pagina.</p>
			<p>
				Se il problema persiste, contattaci
				<a href="mailto:ciao@traquantopassa.in">via email</a>.
			</p>
		{/if}
	</div>

	<FooterNavigation className="my-12" isBus={false} />
</div>
