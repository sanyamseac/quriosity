<script lang="ts">
	import { ArrowUpRight, GitBranch, Video } from '@lucide/svelte';
	import { event } from '#lib/config.ts';
	import { mentions, podium, type Result } from '#lib/content.ts';
	import { submissions } from '#lib/submissions.ts';
	import { reveal } from '#lib/reveal.ts';

	// Join each result to its submission for the option and links.
	const withLinks = (r: Result) => {
		const s = submissions.find((x) => x.team.toLowerCase() === r.team.toLowerCase());
		if (!s) throw new Error(`No submission found for winner "${r.team}"`);
		return { ...r, ...s };
	};

	const places = podium.map((r, i) => ({ ...withLinks(r), place: event.prizes[i] }));
	const special = mentions.map(withLinks);
	const [first, ...runners] = places;

	const rupees = (n: number) => n.toLocaleString('en-IN');
	const ordinal = ['1st', '2nd', '3rd'];
</script>

{#snippet shot(slug: string, title: string, href: string)}
	<a class="shot" {href} target="_blank" rel="noopener" aria-label="Play {title}">
		<img src="/img/winners/{slug}.webp" alt="A screenshot of {title}" width="1200" height="750" loading="lazy" />
	</a>
{/snippet}

{#snippet linkset(s: { game: string; repo: string; video: string | null })}
	<div class="links">
		<a class="play" href={s.game} target="_blank" rel="noopener">Play <ArrowUpRight size={14} strokeWidth={2} /></a>
		<a href={s.repo} target="_blank" rel="noopener"><GitBranch size={16} strokeWidth={1.75} /> Code</a>
		{#if s.video}
			<a href={s.video} target="_blank" rel="noopener"><Video size={16} strokeWidth={1.75} /> Video</a>
		{/if}
	</div>
{/snippet}

<article class="first" use:reveal>
	{@render shot(first.slug, first.title, first.game)}
	<div class="body">
		<p class="rank"><span class="display">{ordinal[0]}</span><span class="prize">₹{rupees(first.place.amount)}</span></p>
		<h3 class="display">{first.title}</h3>
		<p class="team">by <strong>{first.team}</strong> <span class="opt">{first.option.n} {first.option.title}</span></p>
		<p class="blurb">{first.blurb}</p>
		{@render linkset(first)}
	</div>
</article>

<div class="runners">
	{#each runners as r, i}
		<article class="runner" use:reveal={i * 0.08}>
			{@render shot(r.slug, r.title, r.game)}
			<div class="body">
				<p class="rank">
					<span class="display">{ordinal[i + 1]}</span><span class="prize">₹{rupees(r.place.amount)}</span>
				</p>
				<h3 class="display">{r.title}</h3>
				<p class="team">by <strong>{r.team}</strong> <span class="opt">{r.option.n} {r.option.title}</span></p>
				<p class="blurb">{r.blurb}</p>
				{@render linkset(r)}
			</div>
		</article>
	{/each}
</div>

<div class="mentions">
	<h3 class="eyebrow" use:reveal>Special mentions</h3>
	<ul>
		{#each special as m, i}
			<li use:reveal={i * 0.06}>
				{@render shot(m.slug, m.title, m.game)}
				<h4>{m.title}</h4>
				<p class="team">by <strong>{m.team}</strong> <span class="opt">{m.option.title}</span></p>
				<p class="blurb">{m.blurb}</p>
				{@render linkset(m)}
			</li>
		{/each}
	</ul>
</div>

<style>
	article,
	li {
		display: grid;
		align-content: start;
	}

	.shot {
		display: block;
		overflow: hidden;
		border-radius: 18px;
		background: var(--paper-2);
		box-shadow: 0 0 0 1px var(--line);
	}

	.shot img {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		transition: transform 1s var(--ease);
	}

	.shot:hover img {
		transform: scale(1.035);
	}

	.body {
		display: grid;
		align-content: start;
		gap: 14px;
	}

	.rank {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--ink);
	}

	.rank .display {
		font-size: clamp(56px, 6vw, 96px);
		line-height: 0.8;
	}

	.prize {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.04em;
		font-variant-numeric: tabular-nums;
	}

	h3.display {
		font-size: clamp(32px, 3.4vw, 52px);
		line-height: 1;
	}

	.team {
		font-size: 15px;
		color: var(--ink-2);
	}

	.team strong {
		color: var(--ink);
		font-weight: 700;
	}

	.opt {
		display: inline-block;
		margin-left: 8px;
		font-size: 13px;
		font-weight: 600;
		color: var(--red-ink);
	}

	.blurb {
		color: var(--ink-2);
		max-width: 52ch;
		text-wrap: pretty;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 6px;
	}

	.links a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 40px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 14px;
		font-weight: 600;
		transition:
			background 0.3s var(--ease),
			border-color 0.3s var(--ease),
			color 0.3s var(--ease);
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

	/* First place: a wide feature */
	.first {
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		gap: clamp(28px, 4vw, 64px);
		align-items: center;
	}

	.first .rank .display {
		font-size: clamp(80px, 9vw, 150px);
		color: var(--red);
	}

	.first h3.display {
		font-size: clamp(40px, 4.6vw, 72px);
	}

	/* Second and third */
	.runners {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(28px, 4vw, 64px);
		margin-top: clamp(64px, 8vw, 112px);
	}

	.runner {
		gap: 24px;
	}

	/* Special mentions */
	.mentions {
		margin-top: clamp(72px, 9vw, 128px);
		padding-top: 22px;
		border-top: 1px solid var(--line);
	}

	.mentions ul {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(24px, 3vw, 40px);
		margin-top: 28px;
	}

	.mentions li {
		gap: 10px;
	}

	.mentions .shot {
		margin-bottom: 8px;
		border-radius: 14px;
	}

	h4 {
		font-size: 21px;
		font-weight: 700;
		line-height: 1.2;
	}

	.mentions .blurb {
		font-size: 15px;
	}

	.mentions .links a {
		height: 36px;
		padding: 0 14px;
		font-size: 13px;
	}

	@media (max-width: 960px) {
		.first {
			grid-template-columns: 1fr;
		}

		.runners,
		.mentions ul {
			grid-template-columns: 1fr;
		}

		.runners {
			gap: 64px;
		}

		.mentions ul {
			gap: 48px;
		}
	}
</style>
