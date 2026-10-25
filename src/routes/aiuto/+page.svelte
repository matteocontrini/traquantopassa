<script lang="ts">
	import { resolve } from '$app/paths';
	import stopInstructionsImage from '#lib/assets/stop-instructions.png';
</script>

<svelte:head>
	<title>Tra quanto passa</title>
</svelte:head>

<header>
	<h1 class="text-4xl font-semibold">Istruzioni per trovare le fermate</h1>
</header>

<main class="my-8">
	<p>
		Puoi cercare o accedere a qualsiasi fermata di Trento con il <strong
			>codice della fermata</strong
		>.
	</p>

	<p>
		Ad esempio la fermata "stazione FS" ha il codice <code>20125p</code>.
	</p>

	<p>
		Dopo aver tolto la "p" o altri simboli, puoi usare questo codice per filtrare la lista oppure
		per accedere direttamente alla pagina della fermata. Ad esempio:
	</p>

	<p class="text-center">
		<a href={resolve('/[stop]', { stop: '20125' })}>
			<code>traquantopassa.in/20125</code>
		</a>
	</p>

	<p>Puoi trovare il codice di una fermata sulle tabelle degli orari esposti alle fermate:</p>

	<p>
		<img src={stopInstructionsImage} alt="" class="mx-auto" />
	</p>

	<p class="mt-10">
		<a
			class="rounded-md bg-neutral-800 px-3 py-2 no-underline hover:bg-neutral-700"
			href={resolve('/')}
		>
			🚍 Lista fermate autobus
		</a>
	</p>

	<p class="mt-6">
		<a
			class="rounded-md bg-neutral-800 px-3 py-2 no-underline hover:bg-neutral-700"
			href={resolve('/treni')}
		>
			🚆 Lista stazioni treni
		</a>
	</p>

	<p class="mt-6">
		<a
			class="rounded-md bg-neutral-800 px-3 py-2 no-underline hover:bg-neutral-700"
			href={resolve('/info')}
		>
			ℹ️ Informazioni
		</a>
	</p>
</main>
