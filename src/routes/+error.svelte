<script lang="ts">
	import { page } from '$app/state';
	import FooterNavigation from '#lib/components/FooterNavigation.svelte';
</script>

<div class="mt-12 text-center">
	<div class="text-red-500">
		{#if page.status === 404}
			<p>Pagina non trovata 😕</p>
			<p>
				Se pensi sia un errore, contattaci
				<a href="mailto:ciao@traquantopassa.in">via email</a>.
			</p>
		{:else if page.status === 503}
			<p>I dati di Trentino Trasporti non sono al momento disponibili 😕</p>
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

	<FooterNavigation className="my-12" />
</div>
