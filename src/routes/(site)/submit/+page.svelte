<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeft, CircleAlert, Send } from '@lucide/svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import { ratufaLoaderSrc } from '#lib/config.ts';
	import { deliverables, tracks } from '#lib/content.ts';

	const FORM_ID = 'quriosity-submission';
	const live = ratufaLoaderSrc.trim().length > 0;

	let notice = $state('');

	onMount(() => {
		if (!live) return;
		// ratufa finds its loader by this id and binds itself to the form on the page.
		document.getElementById('ratufa_loader')?.remove();
		const script = document.createElement('script');
		script.id = 'ratufa_loader';
		script.src = ratufaLoaderSrc;
		script.async = true;
		document.body.appendChild(script);
		return () => script.remove();
	});

	function onSubmit(e: SubmitEvent) {
		if (live) return; // ratufa handles the submission.
		e.preventDefault();
		notice = 'The form is not accepting entries just yet. It goes live during the sprint, so hold on to those links.';
	}
</script>

<svelte:head>
	<title>Submit your game, quriosity</title>
	<meta name="description" content="Hand in your quriosity game: option, playable link, repository, video and README." />
</svelte:head>

<section class="submit">
	<div class="wrap grid">
		<aside>
			<a class="back" href="/"><ArrowLeft size={16} strokeWidth={2} /> Back to quriosity</a>
			<p class="eyebrow">Final submission</p>
			<h1 class="display">Hand it in</h1>
			<p class="lede">
				Sixteen hours, distilled into one form. Take a breath, check your links open in a private window, and send it
				over.
			</p>

			<ol class="check">
				{#each deliverables as d, i}
					<li><span>0{i + 1}</span>{d.title}</li>
				{/each}
			</ol>

			<div class="count"><Countdown /></div>
		</aside>

		<form id={FORM_ID} method="post" onsubmit={onSubmit}>
			{#if !live}
				<p class="banner" role="status">
					<CircleAlert size={18} strokeWidth={2} />
					Submissions open during the sprint. Feel free to look around until then.
				</p>
			{/if}

			<fieldset>
				<legend>The team</legend>
				<label>
					<span>Team name</span>
					<input name="team_name" type="text" required autocomplete="organization" placeholder="The Superposed" />
				</label>
				<label>
					<span>Members</span>
					<textarea name="members" rows="3" required placeholder="One name per line, up to four people"></textarea>
				</label>
				<label>
					<span>Contact email</span>
					<input name="email" type="email" required autocomplete="email" placeholder="you@students.iiit.ac.in" />
				</label>
			</fieldset>

			<fieldset>
				<legend>Your option</legend>
				<div class="tracks">
					{#each tracks as t}
						<label class="track">
							<input type="radio" name="option" value="{t.n} {t.title}" required />
							<span class="tn">{t.n}</span>
							<span class="tt">{t.title}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend>The links</legend>
				<label>
					<span>Playable game</span>
					<input name="game_link" type="url" required placeholder="https://yourteam.itch.io/game" />
					<small>A hosted link or a direct download of the executable, whichever runs most easily.</small>
				</label>
				<label>
					<span>Public repository</span>
					<input name="repository_link" type="url" required placeholder="https://github.com/yourteam/game" />
				</label>
				<label>
					<span>Gameplay video</span>
					<input name="video_link" type="url" required placeholder="https://youtu.be/" />
					<small>Your team playing, with the core mechanic clearly on show.</small>
				</label>
			</fieldset>

			<fieldset>
				<legend>The fine print</legend>
				<label class="tick">
					<input type="checkbox" name="usage_consent" value="agreed" required />
					<span>
						We agree that ISAQC may use, show, adapt and share our submission in any way it sees fit, without asking
						us for further permission and regardless of the license we release it under. ISAQC may also name and
						quote us as participants or winners whenever it wishes.
					</span>
				</label>
				<label>
					<span>Anything else for the judges <em>(optional)</em></span>
					<textarea name="notes" rows="4" placeholder="Controls, known bugs, a favourite moment"></textarea>
				</label>
			</fieldset>

			<div class="send">
				<button class="btn" type="submit">
					Submit our game
					<Send size={18} strokeWidth={2} />
				</button>
				{#if notice}<p class="notice" role="alert">{notice}</p>{/if}
			</div>
		</form>
	</div>
</section>

<style>
	.submit {
		padding-top: clamp(112px, 14vh, 160px);
		padding-bottom: clamp(88px, 10vw, 144px);
	}

	.grid {
		display: grid;
		grid-template-columns: 5fr 7fr;
		gap: clamp(40px, 6vw, 112px);
		align-items: start;
	}

	aside {
		position: sticky;
		top: 104px;
		display: grid;
		gap: 24px;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-2);
		transition: color 0.3s var(--ease);
	}

	.back:hover {
		color: var(--red);
	}

	h1 {
		font-size: clamp(52px, 6.2vw, 100px);
		white-space: nowrap;
	}

	.lede {
		font-size: clamp(18px, 1.6vw, 22px);
		color: var(--ink-2);
		max-width: 36ch;
	}

	.check {
		display: grid;
		border-top: 1px solid var(--line);
	}

	.check li {
		display: flex;
		gap: 16px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
		font-weight: 600;
	}

	.check span {
		font-size: 13px;
		letter-spacing: 0.12em;
		color: var(--ink-3);
		padding-top: 2px;
	}

	.count {
		padding-top: 8px;
	}

	form {
		display: grid;
		gap: 48px;
	}

	.banner {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border-radius: 14px;
		background: var(--paper-2);
		font-weight: 600;
		font-size: 15px;
	}

	.banner :global(svg) {
		flex: none;
		color: var(--red);
	}

	fieldset {
		display: grid;
		gap: 22px;
		margin: 0;
		padding: 24px 0 0;
		border: 0;
		border-top: 1px solid var(--ink);
	}

	legend {
		float: left;
		width: 100%;
		margin-bottom: 4px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	label {
		display: grid;
		gap: 8px;
	}

	label > span {
		font-weight: 600;
	}

	em {
		font-style: normal;
		color: var(--ink-3);
		font-weight: 500;
	}

	input[type='text'],
	input[type='email'],
	input[type='url'],
	textarea {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: #fbfaf7;
		font-size: 16px;
		font-weight: 500;
		transition:
			border-color 0.3s var(--ease),
			box-shadow 0.3s var(--ease);
	}

	textarea {
		resize: vertical;
		min-height: 96px;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--ink-3);
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--ink);
		box-shadow: 0 0 0 4px rgb(254 68 61 / 0.14);
	}

	small {
		font-size: 14px;
		color: var(--ink-3);
	}

	.tracks {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.track {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 14px;
		padding: 16px 18px;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: #fbfaf7;
		cursor: pointer;
		transition:
			border-color 0.3s var(--ease),
			background 0.3s var(--ease),
			color 0.3s var(--ease);
	}

	.track input {
		position: absolute;
		opacity: 0;
		inset: 0;
		cursor: pointer;
	}

	.track:hover {
		border-color: var(--ink);
	}

	.track:has(input:checked) {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.track:has(input:focus-visible) {
		outline: 2px solid var(--red);
		outline-offset: 3px;
	}

	.tn {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: var(--ink-3);
	}

	.tt {
		font-weight: 700;
		line-height: 1.25;
	}


	.track:has(input:checked) .tn {
		color: var(--night-ink-2);
	}

	.tick {
		grid-template-columns: 24px 1fr;
		align-items: start;
		gap: 14px;
		cursor: pointer;
	}

	.tick input {
		width: 20px;
		height: 20px;
		margin: 3px 0 0;
		accent-color: var(--red);
	}

	.tick span {
		font-weight: 500;
		color: var(--ink-2);
	}

	.send {
		display: grid;
		gap: 16px;
		justify-items: start;
	}

	.notice {
		font-weight: 600;
		color: var(--red-ink);
	}

	@media (max-width: 920px) {
		.grid {
			grid-template-columns: 1fr;
		}

		aside {
			position: static;
		}
	}

	@media (max-width: 560px) {
		.tracks {
			grid-template-columns: 1fr;
		}
	}
</style>
