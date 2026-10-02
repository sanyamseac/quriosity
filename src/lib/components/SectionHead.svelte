<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '#lib/reveal.ts';

	let {
		n,
		label,
		title,
		dark = false,
		children
	}: { n: string; label: string; title: string; dark?: boolean; children?: Snippet } = $props();
</script>

<header class="head" class:dark>
	<div class="meta" use:reveal>
		<span class="n">{n}</span>
		<span class="eyebrow">{label}</span>
	</div>
	<h2 class="display" use:reveal={0.06}>
		{#each title.split('|') as line}<span>{line}</span>{/each}
	</h2>
	{#if children}
		<div class="intro" use:reveal={0.12}>{@render children()}</div>
	{/if}
</header>

<style>
	.head {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 24px;
		row-gap: 20px;
		padding-top: 22px;
		border-top: 1px solid var(--line);
		margin-bottom: clamp(48px, 7vw, 96px);
	}

	.dark {
		border-color: var(--night-line);
	}

	.meta {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.n {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.14em;
		font-variant-numeric: tabular-nums;
		color: var(--ink-3);
		order: 2;
	}

	.dark .n,
	.dark .eyebrow {
		color: var(--night-ink-2);
	}

	h2 {
		grid-column: 1 / span 10;
		font-size: clamp(42px, 7vw, 112px);
		margin-top: clamp(12px, 3vw, 40px);
	}

	h2 span {
		display: block;
	}

	.intro {
		grid-column: 7 / -1;
		font-size: clamp(18px, 1.6vw, 22px);
		line-height: 1.55;
		color: var(--ink-2);
	}

	.dark .intro {
		color: var(--night-ink-2);
	}

	@media (max-width: 860px) {
		h2,
		.intro {
			grid-column: 1 / -1;
		}
	}
</style>
