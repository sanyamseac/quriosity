<script lang="ts">
	let { words }: { words: string[] } = $props();
</script>

<div class="marquee" aria-hidden="true">
	<div class="track">
		{#each [0, 1] as copy (copy)}
			<ul>
				{#each words as word}
					<li><span class="display">{word}</span><i></i></li>
				{/each}
			</ul>
		{/each}
	</div>
</div>

<style>
	.marquee {
		overflow: hidden;
		background: var(--ink);
		color: var(--paper);
		padding: 22px 0;
		mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
	}

	.track {
		display: flex;
		width: max-content;
		animation: slide 48s linear infinite;
	}

	.marquee:hover .track {
		animation-play-state: paused;
	}

	ul {
		display: flex;
		align-items: center;
	}

	li {
		display: flex;
		align-items: center;
		white-space: nowrap;
	}

	span {
		font-size: clamp(28px, 4vw, 56px);
	}

	i {
		width: 12px;
		height: 12px;
		margin: 0 clamp(24px, 3vw, 44px);
		border-radius: 50%;
		background: var(--red);
	}

	@keyframes slide {
		to {
			transform: translateX(-50%);
		}
	}
</style>
