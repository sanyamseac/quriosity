<script lang="ts">
	import { ArrowUpRight, Gamepad2, GitBranch, Video } from '@lucide/svelte';
	import SectionHead from '#lib/components/SectionHead.svelte';
	import { tracks } from '#lib/content.ts';
	import { submissions } from '#lib/submissions.ts';
	import { reveal } from '#lib/reveal.ts';

	const counts = new Map(tracks.map((t) => [t.n, submissions.filter((s) => s.option.n === t.n).length]));

	let filter = $state<string | null>(null);
	const shown = $derived(filter ? submissions.filter((s) => s.option.n === filter) : submissions);

	const host = (url: string) => {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	};
</script>

<svelte:head>
	<title>Submissions, quriosity</title>
	<meta
		name="description"
		content="Every game handed in at quriosity, the quantum game development event by ISAQC. Play them, read the code, watch the videos."
	/>
</svelte:head>

<section class="page">
	<div class="wrap">
		<SectionHead n={String(submissions.length)} label="Submissions" title="The games">
			<p>
				Sixteen hours, {submissions.length} games, and a great deal of very confused physics made clear. Play them,
				poke around the code, or watch the teams show off what they built.
			</p>
		</SectionHead>

		<div class="filters" role="group" aria-label="Filter by option" use:reveal>
			<button class:on={filter === null} aria-pressed={filter === null} onclick={() => (filter = null)}>
				All <span>{submissions.length}</span>
			</button>
			{#each tracks as t}
				{#if counts.get(t.n)}
					<button class:on={filter === t.n} aria-pressed={filter === t.n} onclick={() => (filter = t.n)}>
						{t.title} <span>{counts.get(t.n)}</span>
					</button>
				{/if}
			{/each}
		</div>

		<ol class="list">
			{#each shown as s, i (s.team)}
				<li>
					<span class="idx">{String(i + 1).padStart(2, '0')}</span>
					<div class="who">
						<h3>{s.team}</h3>
						<p class="opt"><span>{s.option.n}</span>{s.option.title}</p>
					</div>
					<div class="links">
						<a class="play" href={s.game} target="_blank" rel="noopener" title={host(s.game)}>
							<Gamepad2 size={17} strokeWidth={1.75} />
							Play
							<ArrowUpRight size={14} strokeWidth={2} />
						</a>
						<a href={s.repo} target="_blank" rel="noopener" title={host(s.repo)}>
							<GitBranch size={17} strokeWidth={1.75} />
							Code
						</a>
						{#if s.video}
							<a href={s.video} target="_blank" rel="noopener" title={host(s.video)}>
								<Video size={17} strokeWidth={1.75} />
								Video
							</a>
						{:else}
							<span class="none" title="No video was submitted">
								<Video size={17} strokeWidth={1.75} />
								No video
							</span>
						{/if}
					</div>
				</li>
			{/each}
		</ol>

		<p class="note">
			Listed by option, then alphabetically by team. The order says nothing about the judging.
		</p>
		<p class="note legal">
			All links point to content created and hosted by the participating teams. ISAQC does not control, endorse or
			take responsibility for any external site, file or repository, so please open them at your own discretion.
		</p>
	</div>
</section>

<style>
	.page {
		padding-top: clamp(120px, 15vh, 176px);
		padding-bottom: clamp(88px, 12vw, 160px);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.filters button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 40px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: transparent;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-2);
		transition:
			background 0.3s var(--ease),
			color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.filters button:hover {
		border-color: var(--ink);
		color: var(--ink);
	}

	.filters button span {
		font-variant-numeric: tabular-nums;
		color: var(--ink-3);
	}

	.filters button.on {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.filters button.on span {
		color: var(--red);
	}

	.list {
		border-top: 1px solid var(--ink);
	}

	.list li {
		display: grid;
		grid-template-columns: 56px minmax(0, 1fr) auto;
		align-items: center;
		gap: 24px;
		padding: 22px 0;
		border-bottom: 1px solid var(--line);
		animation: in 0.5s var(--ease) both;
	}

	.idx {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ink-3);
		font-variant-numeric: tabular-nums;
	}

	.who {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	h3 {
		font-size: clamp(20px, 2vw, 26px);
		font-weight: 700;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.opt {
		display: flex;
		gap: 10px;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-2);
	}

	.opt span {
		color: var(--red-ink);
		letter-spacing: 0.08em;
	}

	.links {
		display: flex;
		gap: 8px;
	}

	.links a,
	.none {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 42px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		transition:
			background 0.3s var(--ease),
			color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.links a:hover {
		border-color: var(--ink);
	}

	.links a.play {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.links a.play:hover {
		background: var(--red);
		border-color: var(--red);
	}

	.none {
		color: var(--ink-3);
		border-style: dashed;
	}

	.note {
		margin-top: 28px;
		font-size: 14px;
		color: var(--ink-3);
	}

	.legal {
		margin-top: 8px;
		max-width: 80ch;
		font-size: 13px;
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@media (max-width: 860px) {
		.list li {
			grid-template-columns: 40px minmax(0, 1fr);
			row-gap: 14px;
		}

		.links {
			grid-column: 2;
			flex-wrap: wrap;
		}
	}

	@media (max-width: 420px) {
		.list li {
			grid-template-columns: minmax(0, 1fr);
		}

		.idx {
			display: none;
		}

		.links {
			grid-column: 1;
		}
	}
</style>
