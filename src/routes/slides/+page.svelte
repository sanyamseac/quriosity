<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowLeft,
		ArrowRight,
		Atom,
		BookOpen,
		Brain,
		Dices,
		DoorOpen,
		Eye,
		Gamepad2,
		Hammer,
		Link,
		Orbit,
		Rocket,
		X
	} from '@lucide/svelte';
	import { slides } from '#lib/content.ts';

	const icons = {
		atom: Atom,
		dices: Dices,
		gamepad: Gamepad2,
		orbit: Orbit,
		eye: Eye,
		link: Link,
		door: DoorOpen,
		book: BookOpen,
		brain: Brain,
		hammer: Hammer,
		rocket: Rocket
	} as Record<string, typeof Atom>;

	const last = slides.length - 1;
	const pad = (n: number) => String(n).padStart(2, '0');

	let index = $state(0);
	let shown = $state(0);
	let typing = $state(false);
	let reduced = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const slide = $derived(slides[index]);
	const done = $derived(shown >= slide.chat.length);
	const nextSpeaker = $derived(slide.chat[shown]?.who ?? 'Alice');
	const lines = $derived(slide.title.split('|'));
	const longest = $derived(Math.max(...lines.map((l) => l.length)));

	function clear() {
		timers.forEach(clearTimeout);
		timers = [];
		typing = false;
	}

	function play() {
		clear();
		shown = 0;
		if (reduced) {
			shown = slides[index].chat.length;
			return;
		}
		let t = 650;
		slides[index].chat.forEach((m, i) => {
			timers.push(setTimeout(() => (typing = true), t));
			t += 750;
			timers.push(
				setTimeout(() => {
					typing = false;
					shown = i + 1;
				}, t)
			);
			t += 550 + Math.min(1700, m.line.length * 20);
		});
	}

	function go(i: number) {
		index = Math.max(0, Math.min(last, i));
		history.replaceState(history.state, '', `#${index + 1}`);
		play();
	}

	function next() {
		if (!done) {
			// First press finishes the conversation, the second moves on.
			clear();
			shown = slide.chat.length;
		} else if (index < last) go(index + 1);
	}

	const prev = () => index > 0 && go(index - 1);

	function onKey(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const k = e.key;
		if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') next();
		else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') prev();
		else if (k === 'Home') go(0);
		else if (k === 'End') go(last);
		else return;
		e.preventDefault();
	}

	let startX = 0;
	let startY = 0;
	function onDown(e: PointerEvent) {
		startX = e.clientX;
		startY = e.clientY;
	}
	function onUp(e: PointerEvent) {
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if ((e.target as HTMLElement).closest('a, button')) return;
		if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
		else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && e.pointerType === 'mouse') next();
	}

	onMount(() => {
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const fromHash = parseInt(location.hash.slice(1), 10);
		index = Number.isFinite(fromHash) ? Math.max(0, Math.min(last, fromHash - 1)) : 0;
		play();
		return clear;
	});
</script>

<svelte:head>
	<title>Alice and Bob explain, quriosity</title>
	<meta name="description" content="Alice and Bob walk you through what quriosity, the quantum game development event by ISAQC, is all about." />
</svelte:head>

<svelte:window onkeydown={onKey} />

<div class="deck">
	<header class="bar wrap">
		<a class="brand" href="/" aria-label="quriosity home">
			<img src="/isaqc.svg" alt="" width="32" height="32" />
			<span class="display">quriosity</span>
		</a>
		<p class="count" aria-live="polite">
			<span class="sr-only">Slide</span>
			<b>{pad(index + 1)}</b><span class="sep">/</span>{pad(slides.length)}
		</p>
		<a class="close" href="/" aria-label="Close the slides">
			<X size={20} strokeWidth={1.75} />
		</a>
	</header>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<main class="stage wrap" onpointerdown={onDown} onpointerup={onUp}>
		{#key index}
			<section class="slide" aria-roledescription="slide" aria-label="{index + 1} of {slides.length}">
				<div class="intro">
					<h1 class="display" style:--len={longest}>
						{#each lines as line, i}
							<span class="clip"><span class="ln" style:--d="{0.08 + i * 0.08}s">{line}</span></span>
						{/each}
					</h1>
					{#if slide.sub}<p class="sub">{slide.sub}</p>{/if}
				</div>

				<div class="chat" aria-live="polite">
					{#each slide.chat.slice(0, shown) as m, i (i)}
						<div class="msg" class:bob={m.who === 'Bob'}>
							<span class="av" aria-hidden="true">{m.who[0]}</span>
							<div class="bubble">
								<span class="who">{m.who}</span>
								<p>{m.line}</p>
							</div>
						</div>
					{/each}

					{#if typing}
						<div class="msg typing" class:bob={nextSpeaker === 'Bob'} aria-label="{nextSpeaker} is typing">
							<span class="av" aria-hidden="true">{nextSpeaker[0]}</span>
							<div class="bubble"><i></i><i></i><i></i></div>
						</div>
					{/if}

					{#if done && slide.chips}
						<ul class="chips">
							{#each slide.chips as c, i}
								{@const Icon = icons[c.icon]}
								<li style:--d="{i * 0.08}s"><Icon size={18} strokeWidth={1.75} />{c.label}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</section>
		{/key}
	</main>

	<footer class="controls wrap">
		<ol class="progress" aria-label="Slides">
			{#each slides as s, i}
				<li>
					<button
						aria-label="Go to slide {i + 1}, {s.tag}"
						aria-current={i === index ? 'step' : undefined}
						onclick={() => go(i)}
					>
						<span
							class="fill"
							style:transform="scaleX({i < index ? 1 : i > index ? 0 : shown / slides[i].chat.length})"
						></span>
					</button>
				</li>
			{/each}
		</ol>

		<div class="nav">
			<p class="hint">Use the arrow keys, or click anywhere</p>
			<button class="round" onclick={prev} disabled={index === 0} aria-label="Previous slide">
				<ArrowLeft size={20} strokeWidth={1.75} />
			</button>
			{#if index === last && done}
				<a class="btn" href="/">Back to quriosity <ArrowRight size={18} strokeWidth={2} /></a>
			{:else}
				<button class="round dark" onclick={next} aria-label="Next">
					<ArrowRight size={20} strokeWidth={1.75} />
				</button>
			{/if}
		</div>
	</footer>
</div>

<style>
	.deck {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--paper);
		user-select: none;
	}

	/* Top bar */
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 76px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font-size: 22px;
	}

	/* Same optical lift as the site nav, so the small caps sit level with the logo. */
	.brand span {
		transform: translateY(-0.27em);
	}

	.count {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ink-3);
		font-variant-numeric: tabular-nums;
	}

	.count b {
		color: var(--ink);
		font-weight: 700;
	}

	.sep {
		margin: 0 6px;
	}

	.close {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--line);
		border-radius: 50%;
		transition:
			border-color 0.3s var(--ease),
			transform 0.6s var(--ease);
	}

	.close:hover {
		border-color: var(--ink);
		transform: rotate(90deg);
	}

	/* Stage */
	.stage {
		display: grid;
		align-items: center;
		padding-block: clamp(24px, 4vh, 56px);
		cursor: default;
	}

	.slide {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		gap: clamp(32px, 6vw, 112px);
		align-items: center;
	}

	.intro {
		container-type: inline-size;
		display: grid;
		gap: 24px;
		align-content: center;
	}

	h1 {
		/* Quantum averages about 0.56em per character, so each title fits its longest line on one row. */
		font-size: min(104px, calc(100cqi / (var(--len) * 0.56)));
		white-space: nowrap;
		line-height: 0.95;
	}

	.clip {
		display: block;
		overflow: hidden;
		padding-bottom: 0.08em;
		margin-bottom: -0.08em;
	}

	.ln {
		display: block;
		animation: up 1s var(--ease) both;
		animation-delay: var(--d);
	}

	.sub {
		max-width: 30ch;
		font-size: clamp(18px, 1.6vw, 24px);
		line-height: 1.45;
		color: var(--ink-2);
		animation: rise 0.9s 0.3s var(--ease) both;
	}

	/* Chat */
	.chat {
		display: grid;
		gap: 18px;
		align-content: center;
		min-height: 360px;
		max-width: 680px;
		width: 100%;
		justify-self: end;
	}

	.msg {
		display: flex;
		align-items: flex-end;
		gap: 14px;
		animation: pop 0.55s var(--ease) both;
	}

	.msg.bob {
		flex-direction: row-reverse;
	}

	.av {
		flex: none;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--red);
		color: #fff;
		font-size: 18px;
		font-weight: 700;
		line-height: 1;
	}

	.bob .av {
		background: var(--ink);
		color: var(--paper);
	}

	.bubble {
		display: grid;
		gap: 4px;
		max-width: min(520px, 100%);
		padding: 14px 20px 16px;
		border: 1px solid var(--line);
		border-radius: 22px 22px 22px 6px;
		background: #fbfaf7;
	}

	.bob .bubble {
		border-color: var(--ink);
		border-radius: 22px 22px 6px 22px;
		background: var(--ink);
		color: var(--paper);
	}

	.who {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--red-ink);
	}

	.bob .who {
		color: var(--night-ink-2);
	}

	.bubble p {
		font-size: clamp(17px, 1.45vw, 22px);
		line-height: 1.45;
		font-weight: 500;
	}

	.typing .bubble {
		display: flex;
		gap: 6px;
		padding: 18px 20px;
	}

	.typing i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.35;
		animation: blink 1s infinite;
	}

	.typing i:nth-child(2) {
		animation-delay: 0.15s;
	}

	.typing i:nth-child(3) {
		animation-delay: 0.3s;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding-top: 8px;
	}

	.chips li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 40px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 15px;
		font-weight: 600;
		animation: pop 0.5s var(--ease) both;
		animation-delay: var(--d);
	}

	.chips li :global(svg) {
		color: var(--red);
	}

	/* Controls */
	.controls {
		display: grid;
		gap: 18px;
		padding-bottom: 28px;
	}

	.progress {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		gap: 6px;
	}

	.progress button {
		display: block;
		width: 100%;
		height: 20px;
		padding: 8px 0;
		border: 0;
		background: linear-gradient(var(--paper-2), var(--paper-2)) center / 100% 3px no-repeat;
	}

	.fill {
		display: block;
		height: 3px;
		border-radius: 999px;
		background: var(--ink);
		transform-origin: left;
		transition: transform 0.6s var(--ease);
	}

	.progress [aria-current] .fill {
		background: var(--red);
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}

	.hint {
		margin-right: auto;
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-3);
	}

	.round {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
		transition:
			background 0.3s var(--ease),
			border-color 0.3s var(--ease),
			color 0.3s var(--ease);
	}

	.round:hover:not(:disabled) {
		border-color: var(--ink);
	}

	.round:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.round.dark {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.round.dark:hover {
		background: var(--red);
		border-color: var(--red);
	}

	@keyframes up {
		from {
			transform: translateY(105%);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.97);
		}
	}

	@keyframes blink {
		50% {
			opacity: 1;
			transform: translateY(-3px);
		}
	}

	@media (max-width: 900px) {
		.slide {
			grid-template-columns: 1fr;
			align-content: start;
		}

		.chat {
			justify-self: stretch;
			min-height: 0;
		}

		.hint {
			display: none;
		}

		.nav {
			justify-content: space-between;
		}

		.controls {
			position: sticky;
			bottom: 0;
			z-index: 2;
			padding-top: 4px;
			padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
			background: linear-gradient(transparent, var(--paper) 22px);
		}
	}

	@media (max-width: 520px) {
		.av {
			width: 36px;
			height: 36px;
			font-size: 15px;
		}

		.count {
			display: none;
		}
	}
</style>
