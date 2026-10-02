<script lang="ts">
	import '@fontsource-variable/quicksand';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" href="/fonts/Quantum.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="icon" type="image/svg+xml" href="/isaqc.svg" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#f2f0eb" />
	<meta property="og:site_name" content="quriosity" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/img/og.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

{@render children()}
