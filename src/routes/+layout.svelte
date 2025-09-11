<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Squadpage 2025-2026 | FDND</title>
</svelte:head>

{@render children?.()}

<style>
</style>
