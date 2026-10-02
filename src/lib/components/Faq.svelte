<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { reveal } from '#lib/reveal.ts';

	let { items }: { items: { q: string; a: string }[] } = $props();
	let open = $state<number | null>(null);
</script>

<ul class="faq">
	{#each items as item, i}
		{@const isOpen = open === i}
		<li class:open={isOpen} use:reveal={i * 0.03}>
			<h3>
				<button id="faq-{i}-btn" aria-expanded={isOpen} aria-controls="faq-{i}" onclick={() => (open = isOpen ? null : i)}>
					<span>{item.q}</span>
					<span class="plus"><Plus size={20} strokeWidth={1.5} /></span>
				</button>
			</h3>
			<div class="body" id="faq-{i}" role="region" aria-labelledby="faq-{i}-btn" inert={!isOpen}>
				<div class="inner"><p>{item.a}</p></div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.faq {
		border-top: 1px solid var(--line);
	}

	li {
		border-bottom: 1px solid var(--line);
	}

	h3 {
		font: inherit;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		width: 100%;
		padding: 26px 0;
		border: 0;
		background: none;
		text-align: left;
		font-size: clamp(19px, 1.8vw, 24px);
		font-weight: 600;
		line-height: 1.3;
	}

	.plus {
		flex: none;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--line);
		border-radius: 50%;
		transition:
			transform 0.6s var(--ease),
			background 0.4s var(--ease),
			color 0.4s var(--ease);
	}

	button:hover .plus {
		border-color: var(--ink);
	}

	.open .plus {
		transform: rotate(45deg);
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.6s var(--ease);
	}

	.open .body {
		grid-template-rows: 1fr;
	}

	.inner {
		overflow: hidden;
	}

	p {
		max-width: 62ch;
		padding-bottom: 28px;
		font-size: 17px;
		color: var(--ink-2);
	}
</style>
