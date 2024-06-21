<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import Train from './Train.svelte';
	import FooterNavigation from '$lib/components/FooterNavigation.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import ModesSwitch from '$lib/components/ModesSwitch.svelte';

	export let data;

	$: details = data.details;
	$: trains = showMore ? details.trains : details.trains.slice(0, 15);
	let showMore = false;
	let showMoreInProgress = false;

	const REFRESH_INTERVAL = 30 * 1000;
	let timer: ReturnType<typeof setInterval>;

	function onVisibilityChange() {
		clearInterval(timer);
		if (document.visibilityState != 'hidden') {
			invalidateAll();
			timer = setInterval(invalidateAll, REFRESH_INTERVAL);
		}
	}

	onMount(() => {
		timer = setInterval(invalidateAll, REFRESH_INTERVAL);
		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			clearInterval(timer);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});
</script>

<svelte:head>
	<title>Stazione di { details.name }</title>
	<link rel="canonical" href="{ PUBLIC_BASE_URL }/treni/{ details.canonicalSlug }" />
</svelte:head>

<header>
	<h1 class="font-semibold text-center text-4xl">Stazione di { details.name }</h1>
	<div class="mt-1 text-sm text-center">
		aggiornato alle
		{
			new Date(details.lastUpdatedAt).toLocaleTimeString(['it-IT'], {
				hour: '2-digit',
				minute: '2-digit',
			})
		}
	</div>

	<div class="mt-6 flex justify-center">
		<ModesSwitch isBus={false} />
	</div>
</header>

<main>
	<div class="mt-10 flex flex-col">
		{#if trains.length > 0}
			{#each trains as train (train.number)}
				<div animate:flip={{delay: 300}}
						 in:fade={{delay: showMoreInProgress ? 0 : 800, duration: 300}}
						 out:fade={{duration: 300}}>
					<Train train={train} />
				</div>
			{/each}

			{#if !showMore }
				<button class="mt-2 px-3 py-1 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700 text-mid"
								on:click={() => {
									showMore = true;
									showMoreInProgress = true;
									setTimeout(() => {
										showMoreInProgress = false;
									}, 50);
								}}>
					Mostra tutti
				</button>
			{/if}
		{:else}
			<div class="text-center">Nessun treno previsto</div>
		{/if}
	</div>
</main>

<footer class="my-12">
	<div class="text-sm text-neutral-500">
		<div>
			Dati RFI. I dati si riferiscono alle partenze. La granularità dei ritardi è di 5 minuti. I dati
			sugli autobus sostitutivi non sono sempre affidabili, verifica sugli orari.
		</div>

		<div class="mt-2">
                        <span class="inline-block w-5">
                            <span class="animate-blink block rounded-full w-2 h-2 bg-white"></span>
                        </span>
			indica che il treno è in partenza.
		</div>

		<div class="mt-2">
			⚠️ indica che i dettagli sul treno cancellato sono temporaneamente non disponibili (il treno
			potrebbe essere sostituito da bus).
		</div>

		<div class="mt-2">La pagina si aggiorna automaticamente ogni 30 secondi.</div>
	</div>

	<FooterNavigation className="mt-6" isBus={false} />
</footer>
