<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Not found, quriosity</title>
</svelte:head>

<section class="wrap err">
	<p class="eyebrow">Error {page.status}</p>
	<h1 class="display">{page.status === 404 ? 'Collapsed' : 'Decohered'}</h1>
	<p>
		{page.status === 404
			? 'You measured this address and found nothing here. The page was never in superposition to begin with.'
			: 'Something went wrong on our side. Even the best qubits lose their coherence now and then.'}
	</p>
	<a class="btn" href="/"><ArrowLeft size={18} strokeWidth={2} /> Back to quriosity</a>
</section>

<style>
	.err {
		min-height: 80vh;
		display: grid;
		align-content: center;
		justify-items: start;
		gap: 28px;
		padding-block: 140px 96px;
	}

	h1 {
		font-size: clamp(64px, 14vw, 220px);
	}

	p:not(.eyebrow) {
		max-width: 40ch;
		font-size: clamp(18px, 1.6vw, 22px);
		color: var(--ink-2);
	}
</style>
