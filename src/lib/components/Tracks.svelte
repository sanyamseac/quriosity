<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import type { Track } from '#lib/content.ts';
	import { reveal } from '#lib/reveal.ts';

	let { tracks }: { tracks: Track[] } = $props();
	let open = $state<string | null>('01');

	const toggle = (n: string) => (open = open === n ? null : n);
	// Keeps kets such as |−⟩ from breaking across lines.
	const nb = (s: string) => s.replace(/\|/g, '|⁠');
</script>

<ol class="tracks">
	{#each tracks as t, i (t.n)}
		{@const isOpen = open === t.n}
		<li class:open={isOpen} use:reveal={i * 0.04}>
			<h3>
				<button
					id="track-{t.n}-btn"
					aria-expanded={isOpen}
					aria-controls="track-{t.n}"
					onclick={() => toggle(t.n)}
				>
					<span class="n">{t.n}</span>
					<span class="name">
						<span class="display title">{t.title}</span>
						<span class="sub">{t.subtitle}</span>
					</span>
					<span class="plus"><Plus size={22} strokeWidth={1.5} /></span>
				</button>
			</h3>

			<div class="body" id="track-{t.n}" role="region" aria-labelledby="track-{t.n}-btn" inert={!isOpen}>
				<div class="inner">
					<div class="grid">
						<p class="plain">{t.plain}</p>
						<dl>
							<div>
								<dt>The principle</dt>
								<dd>{nb(t.principle)}</dd>
							</div>
							<div>
								<dt>The mechanism</dt>
								<dd>{nb(t.mechanism)}</dd>
							</div>
							<div>
								<dt>Ideas worth knowing</dt>
								<dd>
									<ul class="ideas">
										{#each t.ideas as idea}<li>{idea}</li>{/each}
									</ul>
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ol>

<style>
	.tracks {
		border-top: 1px solid var(--night-line);
	}

	.tracks > li {
		border-bottom: 1px solid var(--night-line);
	}

	h3 {
		font: inherit;
	}

	button {
		display: grid;
		grid-template-columns: 72px 1fr 44px;
		align-items: center;
		gap: 24px;
		width: 100%;
		padding: clamp(22px, 3vw, 36px) 0;
		border: 0;
		background: none;
		color: var(--paper);
		text-align: left;
	}

	.n {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--night-ink-2);
		transition: color 0.4s var(--ease);
	}

	.name {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		column-gap: 20px;
		row-gap: 6px;
		transition: transform 0.6s var(--ease);
	}

	.title {
		font-size: clamp(30px, 4.6vw, 68px);
	}

	.sub {
		font-size: clamp(15px, 1.4vw, 19px);
		color: var(--night-ink-2);
	}


	.plus {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--night-line);
		border-radius: 50%;
		transition:
			transform 0.6s var(--ease),
			background 0.4s var(--ease),
			border-color 0.4s var(--ease);
	}

	button:hover .name {
		transform: translateX(10px);
	}

	button:hover .n,
	.open .n {
		color: var(--red);
	}

	.open .plus {
		transform: rotate(45deg);
		background: var(--red);
		border-color: var(--red);
	}

	.body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.7s var(--ease);
	}

	.open .body {
		grid-template-rows: 1fr;
	}

	.inner {
		overflow: hidden;
	}

	.grid {
		display: grid;
		grid-template-columns: 72px 5fr 7fr;
		gap: 24px;
		padding-bottom: clamp(32px, 4vw, 56px);
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.5s var(--ease),
			transform 0.7s var(--ease);
	}

	.open .grid {
		opacity: 1;
		transform: none;
		transition-delay: 0.12s;
	}

	.plain {
		grid-column: 2;
		font-size: clamp(22px, 2.3vw, 32px);
		line-height: 1.3;
		font-weight: 500;
		color: var(--paper);
		max-width: 22ch;
		text-wrap: balance;
	}

	dl {
		grid-column: 3;
		display: grid;
		gap: 28px;
	}

	dt {
		margin-bottom: 8px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--red);
	}

	dd {
		color: #d6d2c9;
		line-height: 1.7;
	}

	.ideas {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.ideas li {
		padding: 6px 14px;
		border: 1px solid var(--night-line);
		border-radius: 999px;
		font-size: 14px;
		color: var(--paper);
	}

	@media (max-width: 860px) {
		button {
			grid-template-columns: 1fr 44px;
			gap: 14px;
		}

		.n {
			display: none;
		}

		.grid {
			grid-template-columns: 1fr;
		}

		.plain,
		dl {
			grid-column: 1;
		}
	}
</style>
