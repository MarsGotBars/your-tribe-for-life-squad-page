<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Squadpage 2025-2026 | FDND</title>
</svelte:head>

<header>
	<h1 class="lg">Frontend Design & Development</h1>
	<p class="sm">Squadpage 2025-2026</p>
</header>

{@render children?.()}

<style>
	@import "./App.css";

	header{
		padding-inline: clamp(0.625rem, 5vw, 2.25rem);
		padding-top: clamp(0.625rem, 5vw, 4rem);
		padding-bottom: 0.625rem;

		h1{
			margin-bottom: 0.75rem;
		}
	}
</style>
