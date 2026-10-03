<script lang="ts">
	import { ArrowUpRight, Menu, X } from '@lucide/svelte';
	import { page } from '$app/state';

	const items = [
		{ href: '/#idea', label: 'Idea' },
		{ href: '/#rules', label: 'Rules' },
		{ href: '/#options', label: 'Options' },
		{ href: '/#schedule', label: 'Schedule' },
		{ href: '/#prizes', label: 'Prizes' },
		{ href: '/#questions', label: 'Questions' }
	];

	let open = $state(false);
	let scrolled = $state(false);
	let hidden = $state(false);
	let lastY = 0;

	function onScroll() {
		const y = window.scrollY;
		scrolled = y > 12;
		hidden = !open && y > 240 && y > lastY;
		lastY = y;
	}

	$effect(() => {
		document.documentElement.style.overflow = open ? 'hidden' : '';
	});

	// Close the menu whenever the route or hash changes.
	$effect(() => {
		page.url.href;
		open = false;
	});
</script>

<svelte:window onscroll={onScroll} onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<a class="skip" href="#main">Skip to content</a>

<header class:scrolled class:hidden class:open>
	<nav class="wrap" aria-label="Main">
		<a class="brand" href="/" aria-label="quriosity home">
			<img src="/isaqc.svg" alt="" width="34" height="34" />
			<span class="display">quriosity</span>
		</a>

		<ul class="links">
			{#each items as item}
				<li><a href={item.href}>{item.label}</a></li>
			{/each}
		</ul>

		<div class="end">
			<a class="cta" href="/submissions">
				View submissions
				<ArrowUpRight size={16} strokeWidth={2} />
			</a>
			<button
				class="toggle"
				aria-expanded={open}
				aria-controls="menu"
				aria-label={open ? 'Close menu' : 'Open menu'}
				onclick={() => (open = !open)}
			>
				{#if open}<X size={22} strokeWidth={1.75} />{:else}<Menu size={22} strokeWidth={1.75} />{/if}
			</button>
		</div>
	</nav>

	<div id="menu" class="sheet" inert={!open}>
		<ul class="wrap">
			{#each items as item, i}
				<li style:--i={i}>
					<a class="display" href={item.href} onclick={() => (open = false)}>{item.label}</a>
				</li>
			{/each}
			<li style:--i={items.length}>
				<a class="display red" href="/submissions" onclick={() => (open = false)}>Submissions</a>
			</li>
		</ul>
	</div>
</header>

<style>
	.skip {
		position: fixed;
		top: 8px;
		left: 8px;
		z-index: 100;
		padding: 10px 16px;
		background: var(--ink);
		color: var(--paper);
		border-radius: 999px;
		transform: translateY(-160%);
		transition: transform 0.3s var(--ease);
	}

	.skip:focus {
		transform: none;
	}

	header {
		position: fixed;
		inset: 0 0 auto;
		z-index: 50;
		transition:
			transform 0.5s var(--ease),
			background 0.4s var(--ease),
			border-color 0.4s var(--ease);
		border-bottom: 1px solid transparent;
	}

	header.scrolled {
		background: rgb(242 240 235 / 0.86);
		backdrop-filter: blur(14px) saturate(1.2);
		-webkit-backdrop-filter: blur(14px) saturate(1.2);
		border-color: var(--line);
	}

	header.hidden {
		transform: translateY(-100%);
	}

	header.open {
		background: var(--paper);
		border-color: var(--line);
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		height: 72px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font-size: 22px;
	}

	.brand img {
		transition: transform 0.8s var(--ease);
	}

	/* Quantum's lowercase is small caps, so its ink sits in the lower half of the line box. Lift it level with the logo. */
	.brand span {
		transform: translateY(-0.27em);
	}

	.brand:hover img {
		transform: rotate(-20deg);
	}

	.links {
		display: flex;
		gap: 4px;
	}

	.links a {
		position: relative;
		display: block;
		padding: 8px 12px;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-2);
		transition: color 0.3s var(--ease);
	}

	.links a::after {
		content: '';
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: 4px;
		height: 1px;
		background: var(--red);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.45s var(--ease);
	}

	.links a:hover {
		color: var(--ink);
	}

	.links a:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.end {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 40px;
		padding: 0 16px 0 18px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--paper);
		font-size: 14px;
		font-weight: 600;
		transition: background 0.3s var(--ease);
	}

	.cta:hover {
		background: var(--red);
	}

	.toggle {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--line);
		border-radius: 50%;
		background: transparent;
	}

	.sheet {
		position: fixed;
		inset: 72px 0 0;
		background: var(--paper);
		padding-top: 24px;
		clip-path: inset(0 0 100% 0);
		transition: clip-path 0.7s var(--ease);
		overflow-y: auto;
	}

	header.open .sheet {
		clip-path: inset(0 0 0 0);
	}

	.sheet li {
		border-bottom: 1px solid var(--line);
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.5s var(--ease),
			transform 0.6s var(--ease);
		transition-delay: calc(0.12s + var(--i) * 0.05s);
	}

	header.open .sheet li {
		opacity: 1;
		transform: none;
	}

	.sheet a {
		display: block;
		padding: 18px 0;
		font-size: clamp(36px, 11vw, 64px);
	}

	.sheet a.red {
		color: var(--red);
	}

	@media (max-width: 980px) {
		.links {
			display: none;
		}

		.toggle {
			display: grid;
		}
	}

	@media (max-width: 520px) {
		.cta {
			display: none;
		}
	}

	@media (min-width: 981px) {
		.sheet {
			display: none;
		}
	}
</style>
