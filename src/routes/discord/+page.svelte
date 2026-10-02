<script lang="ts">
	import { ArrowUpRight, Check, Copy, Download, X } from '@lucide/svelte';
	import QrCode from '#lib/components/QrCode.svelte';
	import { links } from '#lib/config.ts';

	let card: HTMLDivElement;
	let copied = $state(false);
	let saving = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(links.discord);
			copied = true;
			setTimeout(() => (copied = false), 1800);
		} catch {
			copied = false;
		}
	}

	// Inline the logo as a data URI so the saved file works anywhere, offline included.
	async function standaloneSvg() {
		const svg = card.querySelector('svg')!.cloneNode(true) as SVGSVGElement;
		const blob = await (await fetch('/isaqc.svg')).blob();
		const dataUri = await new Promise<string>((resolve) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.readAsDataURL(blob);
		});
		svg.querySelector('image')?.setAttribute('href', dataUri);
		svg.setAttribute('width', '1200');
		svg.setAttribute('height', '1200');
		return new XMLSerializer().serializeToString(svg);
	}

	function download(href: string, name: string) {
		const a = document.createElement('a');
		a.href = href;
		a.download = name;
		a.click();
	}

	async function save(kind: 'png' | 'svg') {
		saving = true;
		try {
			const markup = await standaloneSvg();
			const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
			if (kind === 'svg') {
				download(svgUrl, 'quriosity-discord.svg');
			} else {
				const img = new Image();
				img.src = svgUrl;
				await img.decode();
				const canvas = document.createElement('canvas');
				canvas.width = canvas.height = 1200;
				canvas.getContext('2d')!.drawImage(img, 0, 0, 1200, 1200);
				download(canvas.toDataURL('image/png'), 'quriosity-discord.png');
			}
			setTimeout(() => URL.revokeObjectURL(svgUrl), 2000);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Join us on Discord, quriosity</title>
	<meta
		name="description"
		content="Teammates, announcements and every detail of quriosity live on the ISAQC Discord. Scan the code or open the invite."
	/>
	<meta name="theme-color" content="#0e0e0e" />
</svelte:head>

<div class="page">
	<header class="bar wrap">
		<a class="brand" href="/" aria-label="quriosity home">
			<span class="badge"><img src="/isaqc.svg" alt="" width="26" height="26" /></span>
			<span class="display">quriosity</span>
		</a>
		<a class="close" href="/" aria-label="Back to quriosity">
			<X size={20} strokeWidth={1.75} />
		</a>
	</header>

	<main class="wrap stage">
		<section class="copy">
			<h1 class="display">
				<span class="clip"><span class="ln" style:--d="0.05s">come say</span></span>
				<span class="clip"><span class="ln red" style:--d="0.13s">hello</span></span>
			</h1>
			<p class="lede">
				Teammates, announcements, quick answers and every last detail of quriosity live on our Discord. Point your
				phone camera at the code, or type the link, and pull up a chair.
			</p>

			<div class="link">
				<span class="url">{links.discordLabel}</span>
				<button class="copybtn" onclick={copy} aria-label="Copy the invite link">
					{#if copied}<Check size={18} strokeWidth={2} />{:else}<Copy size={18} strokeWidth={1.75} />{/if}
				</button>
				<span class="sr-only" aria-live="polite">{copied ? 'Link copied' : ''}</span>
			</div>

			<div class="actions">
				<a class="btn light" href={links.discord} target="_blank" rel="noopener">
					Open Discord
					<ArrowUpRight size={18} strokeWidth={2} />
				</a>
				<button class="btn ghost" onclick={() => save('png')} disabled={saving}>
					<Download size={18} strokeWidth={1.75} />
					Save the code
				</button>
				<button class="text" onclick={() => save('svg')} disabled={saving}>or as SVG</button>
			</div>
		</section>

		<figure class="specimen">
			<p class="cap"><span>Figure 02</span><span>An open invitation</span></p>
			<div class="card" bind:this={card}>
				<i class="mark tl"></i><i class="mark tr"></i><i class="mark bl"></i><i class="mark br"></i>
				<QrCode value={links.discord} label="QR code for the quriosity Discord invite" />
			</div>
			<figcaption>Scan with your phone camera</figcaption>
		</figure>
	</main>
</div>

<style>
	.page {
		display: grid;
		grid-template-rows: auto 1fr;
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--night);
		color: var(--paper);
		overflow: hidden;
	}

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

	.brand .display {
		transform: translateY(-0.27em);
	}

	.badge {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--paper);
	}

	.close {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--night-line);
		border-radius: 50%;
		transition:
			border-color 0.3s var(--ease),
			transform 0.6s var(--ease);
	}

	.close:hover {
		border-color: var(--paper);
		transform: rotate(90deg);
	}

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		gap: clamp(40px, 6vw, 112px);
		align-items: center;
		padding-block: clamp(24px, 5vh, 64px);
	}

	.copy {
		container-type: inline-size;
		display: grid;
		gap: 32px;
	}

	h1 {
		/* "come say" is the longest line at eight characters. */
		font-size: min(150px, calc(100cqi / 4.6));
		line-height: 0.92;
		white-space: nowrap;
	}

	.clip {
		display: block;
		overflow: hidden;
		padding-bottom: 0.08em;
		margin-bottom: -0.08em;
	}

	.ln {
		display: block;
		animation: up 1.1s var(--ease) both;
		animation-delay: var(--d);
	}

	.red {
		color: var(--red);
	}

	.lede {
		max-width: 40ch;
		font-size: clamp(18px, 1.6vw, 23px);
		line-height: 1.5;
		color: #d6d2c9;
		animation: rise 0.9s 0.25s var(--ease) both;
	}

	.link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		max-width: 520px;
		padding: 10px 10px 10px 24px;
		border: 1px solid var(--night-line);
		border-radius: 999px;
		animation: rise 0.9s 0.35s var(--ease) both;
	}

	.url {
		font-size: clamp(18px, 1.9vw, 26px);
		font-weight: 700;
		letter-spacing: 0.01em;
		overflow-wrap: anywhere;
		user-select: all;
	}

	.copybtn {
		flex: none;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border: 0;
		border-radius: 50%;
		background: var(--night-2);
		color: var(--paper);
		transition:
			background 0.3s var(--ease),
			color 0.3s var(--ease);
	}

	.copybtn:hover {
		background: var(--red);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		animation: rise 0.9s 0.45s var(--ease) both;
	}

	.btn.ghost {
		--fg: var(--paper);
		border-color: var(--night-line);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: progress;
	}

	.text {
		border: 0;
		background: none;
		padding: 8px 4px;
		font-size: 15px;
		font-weight: 600;
		color: var(--night-ink-2);
		text-decoration: underline;
		text-underline-offset: 4px;
		transition: color 0.3s var(--ease);
	}

	.text:hover {
		color: var(--paper);
	}

	/* The code, presented like a printed specimen */
	.specimen {
		display: grid;
		gap: 16px;
		width: 100%;
		max-width: 500px;
		justify-self: end;
		animation: rise 1s 0.2s var(--ease) both;
	}

	.cap,
	figcaption {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--night-ink-2);
	}

	figcaption {
		justify-content: center;
	}

	.card {
		position: relative;
		padding: clamp(20px, 3vw, 36px);
		border-radius: 32px;
		background: var(--paper);
		box-shadow:
			0 40px 80px -30px rgb(0 0 0 / 0.6),
			0 0 0 1px rgb(242 240 235 / 0.06);
		transition: transform 0.8s var(--ease);
	}

	.card:hover {
		transform: rotate(-1.2deg) scale(1.01);
	}

	.mark {
		position: absolute;
		width: 22px;
		height: 22px;
		border-color: var(--red);
		border-style: solid;
		border-width: 0;
	}

	.tl {
		top: 14px;
		left: 14px;
		border-top-width: 2px;
		border-left-width: 2px;
		border-top-left-radius: 8px;
	}

	.tr {
		top: 14px;
		right: 14px;
		border-top-width: 2px;
		border-right-width: 2px;
		border-top-right-radius: 8px;
	}

	.bl {
		bottom: 14px;
		left: 14px;
		border-bottom-width: 2px;
		border-left-width: 2px;
		border-bottom-left-radius: 8px;
	}

	.br {
		bottom: 14px;
		right: 14px;
		border-bottom-width: 2px;
		border-right-width: 2px;
		border-bottom-right-radius: 8px;
	}

	@keyframes up {
		from {
			transform: translateY(105%);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}

	@media (max-width: 900px) {
		.stage {
			grid-template-columns: 1fr;
			align-content: start;
		}

		.specimen {
			justify-self: center;
			order: -1;
			max-width: 360px;
		}
	}
</style>
