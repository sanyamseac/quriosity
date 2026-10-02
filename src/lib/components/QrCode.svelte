<script lang="ts">
	import { encode } from 'uqr';

	let {
		value,
		label = 'QR code',
		logo = '/isaqc.svg',
		ink = '#0e0e0e',
		paper = '#f2f0eb',
		quiet = 3
	}: { value: string; label?: string; logo?: string; ink?: string; paper?: string; quiet?: number } = $props();

	// Highest error correction, so the logo in the middle can cover a few modules safely.
	const qr = $derived(encode(value, { ecc: 'H', border: 0 }));
	const n = $derived(qr.size);
	const full = $derived(n + quiet * 2);

	// The logo plate covers an odd number of modules, roughly a quarter of the width.
	const plate = $derived(Math.max(5, Math.round(n * 0.24) | 1));
	const lo = $derived((n - plate) / 2);
	const hi = $derived(lo + plate);

	// Every data module becomes a dot. Finder patterns (type 2) are drawn separately below.
	const dots = $derived.by(() => {
		const r = 0.42;
		let d = '';
		for (let y = 0; y < n; y++) {
			for (let x = 0; x < n; x++) {
				if (!qr.data[y][x] || qr.types[y][x] === 2) continue;
				if (x + 1 > lo && x < hi && y + 1 > lo && y < hi) continue;
				d += `M${x + 0.5 - r} ${y + 0.5}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
			}
		}
		return d;
	});

	const finders = $derived([
		[0, 0],
		[n - 7, 0],
		[0, n - 7]
	]);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {full} {full}"
	role="img"
	aria-label={label}
	shape-rendering="geometricPrecision"
>
	<rect width={full} height={full} rx={quiet * 0.9} fill={paper} />
	<g transform="translate({quiet} {quiet})" fill={ink}>
		<path d={dots} />
		{#each finders as [x, y]}
			<rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="1.9" fill="none" stroke={ink} stroke-width="1" />
			<rect x={x + 2} y={y + 2} width="3" height="3" rx="0.95" />
		{/each}
		<rect x={lo + 0.2} y={lo + 0.2} width={plate - 0.4} height={plate - 0.4} rx={plate * 0.22} fill={paper} />
		<image href={logo} x={lo + 0.75} y={lo + 0.75} width={plate - 1.5} height={plate - 1.5} />
	</g>
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
