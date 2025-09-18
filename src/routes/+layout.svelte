<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				console.log('View transition gestart!'); // <- dit zie je in de console
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Squadpage 2025-2026 | FDND</title>
</svelte:head>

{@render children?.()}
