<script lang="ts">
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children } = $props();
</script>

<Nav />
<main id="main">
	{@render children()}
</main>
<Footer />
