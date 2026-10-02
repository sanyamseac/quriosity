<script lang="ts">
	import { onMount } from 'svelte';
	import { event } from '#lib/config.ts';

	const kickoff = Date.parse(event.kickoff);
	const sprintEnd = Date.parse(event.sprintEnd);
	const close = Date.parse(event.close);

	let now = $state<number | null>(null);

	onMount(() => {
		now = Date.now();
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	const phase = $derived.by(() => {
		if (now === null) return { label: 'Kickoff in', target: kickoff };
		if (now < kickoff) return { label: 'Kickoff in', target: kickoff };
		if (now < sprintEnd) return { label: 'The sprint closes in', target: sprintEnd };
		if (now < close) return { label: 'Finals are underway', target: null };
		return { label: 'That is a wrap. Thank you for playing.', target: null };
	});

	const parts = $derived.by(() => {
		if (now === null || phase.target === null) return null;
		let s = Math.max(0, Math.floor((phase.target - now) / 1000));
		const d = Math.floor(s / 86400);
		s -= d * 86400;
		const h = Math.floor(s / 3600);
		s -= h * 3600;
		const m = Math.floor(s / 60);
		s -= m * 60;
		const units = [
			{ v: h, k: 'hours' },
			{ v: m, k: 'minutes' },
			{ v: s, k: 'seconds' }
		];
		return d > 0 ? [{ v: d, k: d === 1 ? 'day' : 'days' }, ...units] : units;
	});

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<div class="count" role="timer" aria-live="off">
	<p class="label">{phase.label}</p>
	{#if phase.target !== null}
		<div class="units">
			{#if parts}
				{#each parts as p (p.k)}
					<div class="unit">
						<span class="display">{pad(p.v)}</span>
						<small>{p.k}</small>
					</div>
				{/each}
			{:else}
				{#each ['hours', 'minutes', 'seconds'] as k}
					<div class="unit"><span class="display">00</span><small>{k}</small></div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.count {
		display: grid;
		gap: 10px;
	}

	.label {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	.units {
		display: flex;
		gap: clamp(14px, 2vw, 28px);
	}

	.unit {
		display: grid;
		gap: 6px;
	}

	.unit span {
		font-size: clamp(34px, 4vw, 56px);
		font-variant-numeric: tabular-nums;
		min-width: 1.4em;
	}

	small {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--ink-3);
	}
</style>
