<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { event, links } from '#lib/config.ts';
	import { reveal } from '#lib/reveal.ts';
	import { submissions } from '#lib/deadline.svelte.ts';

	const elsewhere = [
		{ label: 'Discord', href: links.discord },
		{ label: 'Alice and Bob explain', href: '/slides' },
		{ label: 'ISAQC website', href: links.isaqc },
		{ label: 'Infinium events', href: links.infinium },
		{ label: 'GitHub', href: links.github },
		{ label: 'Instagram', href: links.instagram },
		{ label: 'Email the team', href: `mailto:${links.email}` }
	];
</script>

<footer>
	<div class="wrap">
		<div class="close">
			<h2 class="display" use:reveal>Go make something click</h2>
			<div use:reveal={0.1}>
				<a class="btn light" class:is-closed={submissions.closed} href="/submit">
					{submissions.closed ? 'Submissions closed' : 'Submit your game'}
					<ArrowUpRight size={18} strokeWidth={2} />
				</a>
			</div>
		</div>

		<div class="cols">
			<div class="col org">
				<span class="logo"><img src="/isaqc.svg" alt="The ISAQC logo, a black cat peering at a red atom" width="52" height="52" loading="lazy" /></span>
				<p>
					Brought to you by <strong>{event.organiser}</strong>, the {event.organiserFull}, as part of {event.festival}
					by Felicity, IIIT Hyderabad.
				</p>
			</div>

			<div class="col">
				<h3>Where and when</h3>
				<p>
					{event.venue}<br />
					3 October, 10:30 to 4 October, 06:00<br />
					India Standard Time
				</p>
			</div>

			<div class="col">
				<h3>Elsewhere</h3>
				<ul>
					{#each elsewhere as l}
						<li>
							<a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
								{l.label}
								<ArrowUpRight size={14} strokeWidth={2} />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<div class="mark" aria-hidden="true">
		<span class="display">quriosity</span>
	</div>

	<div class="wrap legal">
		<span>2026 ISAQC, IIIT Hyderabad</span>
		<span>Play first. Understand later.</span>
	</div>
</footer>

<style>
	footer {
		background: var(--night);
		color: var(--paper);
		padding-top: clamp(80px, 12vw, 160px);
		overflow: hidden;
	}

	.close {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px;
		flex-wrap: wrap;
		padding-bottom: clamp(64px, 9vw, 120px);
		border-bottom: 1px solid var(--night-line);
	}

	h2 {
		font-size: clamp(44px, 8vw, 124px);
		max-width: 11ch;
	}

	.cols {
		display: grid;
		grid-template-columns: 5fr 3fr 3fr;
		gap: 40px;
		padding: 56px 0 32px;
	}

	.col {
		display: grid;
		align-content: start;
		gap: 14px;
		font-size: 15px;
		color: var(--night-ink-2);
	}

	.org {
		grid-template-columns: 72px 1fr;
		gap: 20px;
		align-items: start;
	}

	.logo {
		display: grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: var(--paper);
	}

	.org strong {
		color: var(--paper);
		font-weight: 600;
	}

	h3 {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--paper);
	}

	ul {
		display: grid;
		gap: 8px;
	}

	ul a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: color 0.3s var(--ease);
	}

	ul a:hover {
		color: var(--red);
	}

	.mark {
		display: flex;
		justify-content: center;
		margin-top: 24px;
		line-height: 0.74;
		user-select: none;
	}

	.mark span {
		font-size: 19.4vw;
		color: var(--paper);
		white-space: nowrap;
		transform: translateY(6%);
	}

	.legal {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		padding-block: 20px 28px;
		border-top: 1px solid var(--night-line);
		position: relative;
		background: var(--night);
		font-size: 13px;
		color: var(--night-ink-2);
	}

	@media (max-width: 980px) {
		.cols {
			grid-template-columns: 1fr 1fr;
		}

		.org {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 520px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
