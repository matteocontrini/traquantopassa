<script lang="ts">
	import stopInstructionsImage from '$lib/assets/stop-instructions.png';
</script>

<svelte:head>
	Tra quanto passa
</svelte:head>

<header>
	<h1 class="font-semibold text-4xl">Istruzioni per trovare le fermate</h1>
</header>

<main class="my-8">
	<p>
		Puoi cercare o accedere a qualsiasi fermata di Trento con il <strong>codice della fermata</strong>.
	</p>

	<p>
		Ad esempio la fermata "stazione FS" ha il codice <code>20125p</code>.
	</p>

	<p>
		Dopo aver tolto la "p" o altri simboli, puoi usare questo codice per filtrare la lista oppure per accedere direttamente alla pagina della fermata. Ad esempio:
	</p>

	<p class="text-center">
		<a href="/20125">
			<code>traquantopassa.in/20125</code>
		</a>
	</p>

	<p>
		Puoi trovare il codice di una fermata sulle tabelle degli orari esposti alle fermate:
	</p>

	<p>
		<img src={stopInstructionsImage} alt="" class="mx-auto" />
	</p>

	<p class="mt-10">
		<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/">
			🚍 Lista fermate autobus
		</a>
	</p>

	<p class="mt-6">
		<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/treni">
			🚆 Lista stazioni treni
		</a>
	</p>

	<p class="mt-6">
		<a class="px-3 py-2 rounded-md no-underline bg-neutral-800 hover:bg-neutral-700" href="/info">
			ℹ️ Informazioni
		</a>
	</p>
</main>
