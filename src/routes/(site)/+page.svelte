<script lang="ts">
	import {
		ArrowDown,
		ArrowUpRight,
		Check,
		FileText,
		Flag,
		Gamepad2,
		GitBranch,
		Hammer,
		Lightbulb,
		MessageCircle,
		Orbit,
		Rocket,
		Sparkles,
		Users,
		Video
	} from '@lucide/svelte';
	import BlochSphere from '#lib/components/BlochSphere.svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import QrCode from '#lib/components/QrCode.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Marquee from '#lib/components/Marquee.svelte';
	import SectionHead from '#lib/components/SectionHead.svelte';
	import Tracks from '#lib/components/Tracks.svelte';
	import { event, links } from '#lib/config.ts';
	import { concepts, deliverables, dialogue, faqs, principles, timeline, tracks, values } from '#lib/content.ts';
	import { reveal } from '#lib/reveal.ts';
	import { submissions } from '#lib/deadline.svelte.ts';

	const ruleIcons = [Gamepad2, Lightbulb, Orbit, Users, Hammer, Sparkles, Rocket];
	const deliverableIcons = [Flag, Gamepad2, GitBranch, Video, FileText];

	const rupees = (n: number) => n.toLocaleString('en-IN');
	const pool = event.prizes.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

	const stats = [
		{ n: '16', label: 'hours of building' },
		{ n: '20', label: 'hours from kickoff to finals' },
		{ n: '6', label: 'options to choose from' },
		{ n: '4', label: 'people per team, at most' }
	];

	const letters = 'quriosity'.split('');
</script>

<svelte:head>
	<title>quriosity, quantum game development by ISAQC</title>
	<meta
		name="description"
		content="quriosity is a sixteen hour quantum game development event by ISAQC at Infinium 2026, IIIT Hyderabad. Build a game where the rules of play are the rules of quantum physics."
	/>
	<meta property="og:title" content="quriosity, quantum game development" />
	<meta
		property="og:description"
		content="Sixteen hours, six options, one rule: the physics has to be the game. 3 to 4 October 2026, H204, IIIT Hyderabad."
	/>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="wrap hero-grid">
		<div class="hero-copy">
			<p class="eyebrow bare rise" style:--d="0.05s">ISAQC at {event.festival}</p>

			<h1 class="display wordmark" aria-label="quriosity">
				{#each letters as l, i}
					<span class="clip"><span class="ch" style:--d="{0.12 + i * 0.045}s">{l}</span></span>
				{/each}
			</h1>

			<p class="lede rise" style:--d="0.55s">
				Sixteen hours of game development where the rules of play are the rules of the universe. Build a game, and let
				the physics do the teaching.
			</p>

			<dl class="facts rise" style:--d="0.65s">
				<div><dt>When</dt><dd>3 to 4 October 2026</dd></div>
				<div><dt>Where</dt><dd>{event.venue}</dd></div>
				<div><dt>Teams</dt><dd>Solo, or up to {event.teamSize}</dd></div>
				<div><dt>Prize pool</dt><dd>₹{rupees(pool)}</dd></div>
			</dl>

			<div class="ctas rise" style:--d="0.75s">
				<a class="btn" href="#options">
					Explore the options
					<ArrowDown size={18} strokeWidth={2} />
				</a>
				<a class="btn ghost" class:is-closed={submissions.closed} href="/submit">
					{submissions.closed ? 'Submissions closed' : 'Submit your game'}
					<ArrowUpRight size={18} strokeWidth={2} />
				</a>
			</div>

			<div class="below rise" style:--d="0.85s">
				<Countdown />
				<div class="discord">
					<a class="mini" href="/discord" aria-label="Show the Discord QR code full screen">
						<QrCode value={links.discord} label="QR code for the quriosity Discord invite" quiet={2} />
					</a>
					<a class="dtext" href={links.discord} target="_blank" rel="noopener">
						<span class="dk">Join us on Discord</span>
						<span class="dv">Teammates, announcements and every detail, all in one place.</span>
						<span class="du">{links.discordLabel} <ArrowUpRight size={14} strokeWidth={2} /></span>
					</a>
				</div>
			</div>
		</div>

		<div class="hero-figure rise" style:--d="0.35s">
			<p class="fig-label"><span>Figure 01</span><span>A qubit, yours to poke</span></p>
			<BlochSphere />
		</div>
	</div>
</section>

<Marquee words={concepts} />

<!-- 01 The idea -->
<section id="idea" class="section">
	<div class="wrap">
		<SectionHead n="01" label="The idea" title="Play first|Understand later">
			<p>
				Nobody falls for quantum mechanics by reading a textbook at two in the morning. People fall for it by poking at
				it, getting it gloriously wrong, and poking once more. So here is the brief: build a game that teaches one real
				piece of quantum physics, without a single lecture.
			</p>
		</SectionHead>

		<div class="dialogue">
			{#each dialogue as d, i}
				<div class="line" class:bob={d.who === 'Bob'} use:reveal={i * 0.05}>
					<span class="who display">{d.who}</span>
					<p>{d.line}</p>
				</div>
			{/each}
			<a class="more" href="/slides" use:reveal>
				<MessageCircle size={18} strokeWidth={1.75} />
				Hear the whole conversation
				<ArrowUpRight size={16} strokeWidth={2} />
			</a>
		</div>

		<ul class="stats">
			{#each stats as s, i}
				<li use:reveal={i * 0.06}>
					<span class="display">{s.n}</span>
					<p>{s.label}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 02 Ground rules -->
<section id="rules" class="section">
	<div class="wrap">
		<SectionHead n="02" label="Ground rules" title="Seven ground rules">
			<p>
				Not legal fine print. Think of these as the physics of the event itself. Bend them and things start to wobble;
				break them and the whole thing collapses.
			</p>
		</SectionHead>

		<ol class="rules">
			{#each principles as p, i}
				{@const Icon = ruleIcons[i]}
				<li use:reveal={(i % 2) * 0.06}>
					<span class="idx">0{i + 1}</span>
					<span class="ico"><Icon size={22} strokeWidth={1.5} /></span>
					<h3 class="display">{p.title}</h3>
					<p>{p.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- 03 Options -->
<section id="options" class="section dark">
	<div class="wrap">
		<SectionHead n="03" label="The options" title="Six ways in" dark>
			<p>
				Six doors into the same strange house. Pick the one that sparks something and let it shape the entire game.
				Each is a real piece of physics, and each is stranger than it first appears.
			</p>
		</SectionHead>

		<Tracks {tracks} />
	</div>
</section>

<!-- 04 Schedule -->
<section id="schedule" class="section">
	<div class="wrap">
		<SectionHead n="04" label="Schedule" title="One long night">
			<p>
				Twenty hours from kickoff to the final pitch, sixteen of them spent building. Pace yourselves, drink water, and
				save a little wonder for the demo.
			</p>
		</SectionHead>

		<ol class="timeline">
			{#each timeline as t, i}
				<li use:reveal={i * 0.07}>
					<span class="dot" class:first={i === 0}></span>
					<p class="when">{t.when}</p>
					<h3 class="display">{t.title}</h3>
					<p class="what">{t.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- 05 Deliverables -->
<section id="deliverables" class="section">
	<div class="wrap">
		<SectionHead n="05" label="Deliverables" title="What to hand in">
			<p>
				Five things, all through one form. Leave any of them out and the judges get sad, and sad judges are not a
				winning strategy.
			</p>
		</SectionHead>

		<ol class="deliver">
			{#each deliverables as d, i}
				{@const Icon = deliverableIcons[i]}
				<li use:reveal={i * 0.06}>
					<div class="top">
						<span class="idx">0{i + 1}</span>
						<Icon size={22} strokeWidth={1.5} />
					</div>
					<h3>{d.title}</h3>
					<p>{d.body}</p>
				</li>
			{/each}
		</ol>

		<div class="deliver-cta" use:reveal>
			<p>
				{submissions.closed
					? 'Submissions closed at 03:01 on 4 October. Thank you to every team that handed in a game.'
					: 'The submission form lives on its own page, ready when you are.'}
			</p>
			<a class="btn" class:is-closed={submissions.closed} href="/submit">
				{submissions.closed ? 'Submissions closed' : 'Open the submission form'}
				<ArrowUpRight size={18} strokeWidth={2} />
			</a>
		</div>
	</div>
</section>

<!-- 06 Prizes -->
<section id="prizes" class="section">
	<div class="wrap">
		<SectionHead n="06" label="Prizes" title="The spoils">
			<p>
				A prize pool of ₹{rupees(pool)}, split three ways. The glory, as always, is shared by anyone who makes a quantum
				idea finally click for somebody else.
			</p>
		</SectionHead>

		<div class="prizes">
			{#each event.prizes as p, i}
				<div class="prize" class:gold={i === 0} use:reveal={i * 0.08}>
					<p class="place">{p.place} place</p>
					<p class="amount"><span class="rs">₹</span><span class="display">{rupees(p.amount)}</span></p>
				</div>
			{/each}
		</div>

		<div class="values" use:reveal>
			<h3 class="eyebrow">What the guidelines reward</h3>
			<ul>
				{#each values as v}
					<li><Check size={18} strokeWidth={2} /> {v}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<!-- 07 Questions -->
<section id="questions" class="section">
	<div class="wrap">
		<SectionHead n="07" label="Questions" title="Fair questions">
			<p>
				Something we have not covered? Ask us on <a class="inline" href={links.discord} target="_blank" rel="noopener"
					>Discord</a
				>, find any ISAQC volunteer in H204, or write to us. We are friendlier than a decoherent qubit, we promise.
			</p>
		</SectionHead>

		<Faq items={faqs} />
	</div>
</section>

<style>
	/* Hero */
	.hero {
		position: relative;
		padding-top: clamp(104px, 13vh, 150px);
		padding-bottom: clamp(56px, 8vw, 104px);
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		gap: clamp(32px, 5vw, 80px);
		align-items: center;
	}

	.hero-copy {
		container-type: inline-size;
		display: grid;
		gap: 28px;
		align-content: start;
	}

	.wordmark {
		/* The wordmark is 4.8em wide, so 20cqi keeps it inside its own column at every width. */
		font-size: min(20cqi, 196px);
		line-height: 0.82;
		margin: 4px 0 8px -0.04em;
		white-space: nowrap;
	}

	.clip {
		display: inline-block;
		overflow: hidden;
		padding-bottom: 0.06em;
		margin-bottom: -0.06em;
	}

	.ch {
		display: inline-block;
		transform: translateY(105%);
		animation: up 1.1s var(--ease) forwards;
		animation-delay: var(--d);
	}

	.rise {
		opacity: 0;
		transform: translateY(18px);
		animation: rise 1s var(--ease) forwards;
		animation-delay: var(--d, 0s);
	}

	@keyframes up {
		to {
			transform: none;
		}
	}

	@keyframes rise {
		to {
			opacity: 1;
			transform: none;
		}
	}

	.lede {
		max-width: 34ch;
		font-size: clamp(20px, 1.9vw, 27px);
		line-height: 1.4;
		font-weight: 500;
		text-wrap: pretty;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(4, auto);
		justify-content: start;
		gap: 12px 40px;
		padding-block: 20px;
		border-block: 1px solid var(--line);
	}

	.facts dt {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	.facts dd {
		font-weight: 600;
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.below {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}

	.discord {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 10px 22px 10px 10px;
		border: 1px solid var(--line);
		border-radius: 20px;
		background: #fbfaf7;
		transition:
			border-color 0.3s var(--ease),
			transform 0.6s var(--ease);
	}

	.discord:hover {
		border-color: var(--ink);
	}

	.mini {
		flex: none;
		width: 92px;
		border-radius: 12px;
		overflow: hidden;
		transition: transform 0.6s var(--ease);
	}

	.mini:hover {
		transform: scale(1.06) rotate(-3deg);
	}

	.dtext {
		display: grid;
		gap: 2px;
		max-width: 250px;
	}

	.dk {
		font-weight: 700;
		font-size: 16px;
	}

	.dv {
		font-size: 14px;
		line-height: 1.4;
		color: var(--ink-2);
	}

	.du {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 4px;
		font-size: 14px;
		font-weight: 700;
		color: var(--red-ink);
	}

	.dtext:hover .du {
		color: var(--red);
	}

	.section :global(a.inline) {
		color: var(--ink);
		border-bottom: 1px solid var(--red);
		transition: color 0.3s var(--ease);
	}

	.section :global(a.inline:hover) {
		color: var(--red-ink);
	}

	@container (max-width: 520px) {
		.mini {
			display: none;
		}

		.discord {
			padding-left: 20px;
		}
	}

	.hero-figure {
		position: relative;
		max-width: 540px;
		width: 100%;
		justify-self: end;
	}

	.fig-label {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	/* Shared section rhythm */
	.section {
		padding-block: clamp(88px, 12vw, 176px);
	}

	.section.dark {
		background: var(--night);
		color: var(--paper);
	}

	/* 01 Idea */
	.dialogue {
		display: grid;
		gap: 0;
		margin-bottom: clamp(72px, 10vw, 140px);
	}

	.line {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 24px;
		padding-block: 28px;
		border-bottom: 1px solid var(--line);
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		width: fit-content;
		margin-top: 28px;
		font-weight: 600;
		border-bottom: 1px solid var(--ink);
		padding-bottom: 4px;
		transition:
			color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.more:hover {
		color: var(--red);
		border-color: var(--red);
	}

	.line:first-child {
		border-top: 1px solid var(--line);
	}

	.who {
		grid-column: 1 / span 2;
		font-size: 22px;
		display: flex;
		align-items: center;
		gap: 12px;
		align-self: start;
		padding-top: 6px;
	}

	.who::before {
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--red);
	}

	.bob .who::before {
		background: var(--ink);
	}

	.line p {
		grid-column: 3 / span 8;
		font-size: clamp(22px, 2.5vw, 36px);
		line-height: 1.3;
		font-weight: 500;
		text-wrap: pretty;
	}

	.bob p {
		grid-column: 4 / span 8;
		color: var(--ink-2);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.stats li {
		display: grid;
		gap: 12px;
		padding-top: 20px;
		border-top: 1px solid var(--ink);
	}

	.stats span {
		font-size: clamp(72px, 10vw, 156px);
		line-height: 0.85;
	}

	.stats li:first-child span {
		color: var(--red);
	}

	.stats p {
		color: var(--ink-2);
		font-weight: 600;
	}

	/* 02 Rules */
	.rules {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: clamp(32px, 5vw, 80px);
	}

	.rules li {
		display: grid;
		grid-template-columns: 44px 1fr 44px;
		column-gap: 16px;
		row-gap: 14px;
		padding-block: 32px 40px;
		border-top: 1px solid var(--line);
	}

	.rules .idx {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ink-3);
		padding-top: 8px;
		transition: color 0.4s var(--ease);
	}

	.rules .ico {
		grid-column: 3;
		grid-row: 1;
		justify-self: end;
		color: var(--ink-3);
		transition:
			color 0.4s var(--ease),
			transform 0.6s var(--ease);
	}

	.rules h3 {
		grid-column: 2;
		grid-row: 1;
		font-size: clamp(26px, 2.6vw, 38px);
	}

	.rules p {
		grid-column: 2 / span 2;
		color: var(--ink-2);
		max-width: 52ch;
	}

	.rules li:hover .idx,
	.rules li:hover .ico {
		color: var(--red);
	}

	.rules li:hover .ico {
		transform: rotate(-12deg) scale(1.08);
	}

	/* 04 Timeline */
	.timeline {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 24px;
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		top: 6px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--line);
	}

	.timeline li {
		position: relative;
		display: grid;
		align-content: start;
		gap: 12px;
	}

	.dot {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		border: 1px solid var(--ink);
		background: var(--paper);
		margin-bottom: 18px;
		position: relative;
	}

	.dot.first {
		background: var(--red);
		border-color: var(--red);
	}

	.when {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	.timeline h3 {
		font-size: clamp(26px, 2.4vw, 36px);
	}

	.what {
		color: var(--ink-2);
		font-size: 16px;
	}

	/* 05 Deliverables */
	.deliver {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border-top: 1px solid var(--ink);
	}

	.deliver li {
		display: grid;
		align-content: start;
		gap: 12px;
		padding: 24px 24px 40px 0;
		border-right: 1px solid var(--line);
		margin-right: 24px;
	}

	.deliver li:last-child {
		border-right: 0;
		margin-right: 0;
	}

	.deliver .top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 36px;
		color: var(--ink-3);
	}

	.deliver .idx {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.12em;
	}

	.deliver h3 {
		font-size: 20px;
		font-weight: 700;
		line-height: 1.25;
	}

	.deliver p {
		color: var(--ink-2);
		font-size: 16px;
	}

	.deliver-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 20px;
		margin-top: 56px;
		padding: 28px 32px;
		background: var(--paper-2);
		border-radius: 20px;
	}

	.deliver-cta p {
		font-size: clamp(18px, 1.6vw, 22px);
		font-weight: 600;
	}

	/* 06 Prizes */
	.prizes {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr;
		gap: 24px;
		align-items: start;
	}

	.prize {
		display: grid;
		gap: 24px;
		padding: 24px 0 0;
		border-top: 1px solid var(--ink);
	}

	.place {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	.amount {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		line-height: 0.85;
	}

	.amount .display {
		font-size: clamp(56px, 7.4vw, 116px);
	}

	.gold .amount .display {
		font-size: clamp(72px, 11vw, 176px);
		color: var(--red);
	}

	.rs {
		font-size: clamp(22px, 2.4vw, 36px);
		font-weight: 600;
		padding-top: 0.15em;
	}

	.values {
		display: grid;
		grid-template-columns: 4fr 8fr;
		align-items: start;
		gap: 24px;
		margin-top: clamp(64px, 8vw, 112px);
		padding-top: 24px;
		border-top: 1px solid var(--line);
	}

	.values ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px 32px;
	}

	.values li {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		font-size: 17px;
		font-weight: 600;
	}

	.values li :global(svg) {
		flex: none;
		margin-top: 4px;
		color: var(--red);
	}

	/* Responsive */
	@media (max-width: 1320px) {
		.facts {
			grid-template-columns: repeat(2, auto);
		}
	}

	@media (max-width: 1100px) {
		.deliver {
			grid-template-columns: repeat(3, 1fr);
			row-gap: 0;
		}

		.deliver li:nth-child(3) {
			border-right: 0;
			margin-right: 0;
		}

		.deliver li:nth-child(n + 4) {
			border-top: 1px solid var(--line);
		}

		.timeline {
			grid-template-columns: repeat(3, 1fr);
			row-gap: 56px;
		}
	}

	@media (max-width: 920px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}

		.hero-figure {
			justify-self: center;
		}

		.who {
			grid-column: 1 / -1;
			margin-bottom: 10px;
		}

		.line p,
		.bob p {
			grid-column: 1 / -1;
		}

		.stats {
			grid-template-columns: 1fr 1fr;
			row-gap: 48px;
		}

		.rules {
			grid-template-columns: 1fr;
		}

		.prizes {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.values {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.timeline {
			grid-template-columns: 1fr;
			row-gap: 40px;
			padding-left: 32px;
		}

		.timeline::before {
			top: 0;
			bottom: 0;
			left: 6px;
			right: auto;
			width: 1px;
			height: auto;
		}

		.dot {
			position: absolute;
			left: -32px;
			top: 2px;
			margin: 0;
		}

		.deliver {
			grid-template-columns: 1fr;
		}

		.deliver li,
		.deliver li:nth-child(3) {
			border-right: 0;
			margin-right: 0;
			padding: 24px 0 28px;
		}

		.deliver li + li {
			border-top: 1px solid var(--line);
		}

		.deliver .top {
			margin-bottom: 8px;
		}

		.values ul {
			grid-template-columns: 1fr;
		}

		.rules li {
			grid-template-columns: 36px 1fr 32px;
		}
	}

	@media (max-width: 420px) {
		.facts {
			grid-template-columns: 1fr 1fr;
			column-gap: 20px;
		}
	}
</style>
