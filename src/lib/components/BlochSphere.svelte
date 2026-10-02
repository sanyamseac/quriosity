<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye, RotateCcw } from '@lucide/svelte';

	type V = [number, number, number];
	type Basis = 'Z' | 'X';

	const START = { theta: 1.05, phi: -0.15 };
	const PITCH = 0.36;
	const INK = '14,14,14';
	const RED = '#fe443d';

	let canvas: HTMLCanvasElement;
	let theta = $state(START.theta);
	let phi = $state(START.phi);
	let basis = $state<Basis>('Z');
	let message = $state('Drag the red dot to set the qubit, then measure it.');
	let lastBasis: Basis | null = null;

	const pZero = $derived(Math.cos(theta / 2) ** 2);
	const pPlus = $derived((1 + Math.sin(theta) * Math.cos(phi)) / 2);
	const pFirst = $derived(basis === 'Z' ? pZero : pPlus);
	const names = $derived(basis === 'Z' ? ['|0⟩', '|1⟩'] : ['|+⟩', '|−⟩']);

	const pct = (p: number) => `${Math.round(p * 100)}%`;
	const toVec = (t: number, p: number): V => [Math.sin(t) * Math.cos(p), Math.sin(t) * Math.sin(p), Math.cos(t)];

	function setFromVec(v: V) {
		const len = Math.hypot(v[0], v[1], v[2]) || 1;
		const z = Math.max(-1, Math.min(1, v[2] / len));
		theta = Math.acos(z);
		if (Math.abs(v[0]) + Math.abs(v[1]) > 1e-6) phi = Math.atan2(v[1], v[0]);
	}

	// Camera and animation state, kept outside of reactivity on purpose.
	let yaw = -0.4;
	let dragging = false;
	let reduced = false;
	let tween: { from: V; to: V; t0: number; dur: number } | null = null;
	let ripple: { at: V; t0: number } | null = null;
	let trail: { v: V; t: number }[] = [];

	function measure() {
		if (tween) return;
		const up = Math.random() < pFirst;
		const outcome = up ? names[0] : names[1];
		const to: V = basis === 'Z' ? [0, 0, up ? 1 : -1] : [up ? 1 : -1, 0, 0];

		if (lastBasis === null) {
			message = `It collapsed to ${outcome}. Measure in ${basis} again and you will get ${outcome} every single time. Now try the other basis.`;
		} else if (lastBasis === basis) {
			message = `${outcome} again. Once a qubit has collapsed, the answer stays put.`;
		} else {
			message = `It collapsed to ${outcome}. Switching bases scrambled it, and the previous answer is gone for good.`;
		}
		lastBasis = basis;
		animateTo(to);
		ripple = { at: to, t0: performance.now() };
	}

	function reset() {
		lastBasis = null;
		message = 'Back in superposition. Drag the red dot, or measure it straight away.';
		animateTo(toVec(START.theta, START.phi));
	}

	function animateTo(to: V) {
		const from = toVec(theta, phi);
		if (reduced) {
			setFromVec(to);
			return;
		}
		// Nudge antipodal moves sideways so the interpolation never passes through the centre.
		if (from[0] * to[0] + from[1] * to[1] + from[2] * to[2] < -0.995) from[1] += 0.08;
		tween = { from, to, t0: performance.now(), dur: 620 };
	}

	const easeOutBack = (x: number) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

		let size = 0;
		let dpr = 1;
		let raf = 0;
		let last = performance.now();
		let visible = true;

		const ro = new ResizeObserver(() => {
			size = canvas.clientWidth;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(size * dpr);
			canvas.height = Math.round(size * dpr);
			// Resizing clears the canvas, so paint straight away instead of waiting for the next frame.
			if (size) draw(performance.now());
		});
		ro.observe(canvas);

		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			if (visible && !raf) raf = requestAnimationFrame(frame);
		});
		io.observe(canvas);

		const camera = () => ({ cy: Math.cos(yaw), sy: Math.sin(yaw), cp: Math.cos(PITCH), sp: Math.sin(PITCH) });

		function project(v: V, R: number, c = camera()): [number, number, number] {
			const x1 = v[0] * c.cy - v[1] * c.sy;
			const y1 = v[0] * c.sy + v[1] * c.cy;
			const Y = y1 * c.sp + v[2] * c.cp;
			const Z = -y1 * c.cp + v[2] * c.sp;
			return [size / 2 + x1 * R, size / 2 - Y * R, Z];
		}

		function fromPointer(e: PointerEvent): V {
			const r = canvas.getBoundingClientRect();
			const R = r.width * 0.36;
			let X = (e.clientX - r.left - r.width / 2) / R;
			let Y = -(e.clientY - r.top - r.height / 2) / R;
			const d = X * X + Y * Y;
			let Z = 0;
			if (d > 1) {
				X /= Math.sqrt(d);
				Y /= Math.sqrt(d);
			} else Z = Math.sqrt(1 - d);
			const c = camera();
			const y1 = Y * c.sp - Z * c.cp;
			const z1 = Y * c.cp + Z * c.sp;
			return [X * c.cy + y1 * c.sy, -X * c.sy + y1 * c.cy, z1];
		}

		const depthAlpha = (z: number, base: number) => {
			const k = Math.max(0, Math.min(1, (z + 0.18) / 0.36));
			return base * (0.2 + 0.8 * k * k * (3 - 2 * k));
		};

		function curve(fn: (t: number) => V, R: number, base: number, width: number, c: ReturnType<typeof camera>) {
			const N = 128;
			let prev = project(fn(0), R, c);
			ctx.lineWidth = width;
			for (let i = 1; i <= N; i++) {
				const cur = project(fn((i / N) * Math.PI * 2), R, c);
				ctx.strokeStyle = `rgba(${INK},${depthAlpha((prev[2] + cur[2]) / 2, base)})`;
				ctx.beginPath();
				ctx.moveTo(prev[0], prev[1]);
				ctx.lineTo(cur[0], cur[1]);
				ctx.stroke();
				prev = cur;
			}
		}

		function line(a: V, b: V, R: number, alpha: number, c: ReturnType<typeof camera>, dash: number[] = []) {
			const p = project(a, R, c);
			const q = project(b, R, c);
			ctx.setLineDash(dash);
			ctx.strokeStyle = `rgba(${INK},${depthAlpha((p[2] + q[2]) / 2, alpha)})`;
			ctx.beginPath();
			ctx.moveTo(p[0], p[1]);
			ctx.lineTo(q[0], q[1]);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		function draw(now: number) {
			const R = size * 0.36;
			const c = camera();
			const s = Math.max(0.7, size / 520);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, size, size);

			// Volume: a barely-there highlight so the wireframe reads as a ball.
			const g = ctx.createRadialGradient(size / 2 - R * 0.4, size / 2 - R * 0.5, R * 0.1, size / 2, size / 2, R);
			g.addColorStop(0, 'rgba(255,255,255,0.55)');
			g.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, R, 0, Math.PI * 2);
			ctx.fill();

			// Latitudes and meridians.
			for (const z of [-0.5, 0.5]) {
				const r = Math.sqrt(1 - z * z);
				curve((t) => [r * Math.cos(t), r * Math.sin(t), z], R, 0.32, 1, c);
			}
			for (const m of [Math.PI / 4, (3 * Math.PI) / 4]) {
				curve((t) => [Math.cos(m) * Math.sin(t), Math.sin(m) * Math.sin(t), Math.cos(t)], R, 0.22, 1, c);
			}
			curve((t) => [Math.sin(t), 0, Math.cos(t)], R, 0.42, 1, c);
			curve((t) => [0, Math.sin(t), Math.cos(t)], R, 0.42, 1, c);
			curve((t) => [Math.cos(t), Math.sin(t), 0], R, 0.75, 1.3, c);

			// Silhouette.
			ctx.strokeStyle = `rgba(${INK},0.9)`;
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, R, 0, Math.PI * 2);
			ctx.stroke();

			// Axes.
			ctx.lineWidth = 1;
			line([0, 0, -1.22], [0, 0, 1.22], R, 0.6, c, [2, 4]);
			line([-1.18, 0, 0], [1.18, 0, 0], R, 0.45, c, [2, 4]);
			line([0, -1.18, 0], [0, 1.18, 0], R, 0.3, c, [2, 4]);

			// Axis labels.
			ctx.font = `600 ${Math.round(14 * s)}px "Quicksand Variable", Quicksand, system-ui, sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const labels: [V, string][] = [
				[[0, 0, 1.36], '|0⟩'],
				[[0, 0, -1.36], '|1⟩'],
				[[1.34, 0, 0], '|+⟩'],
				[[-1.34, 0, 0], '|−⟩']
			];
			for (const [v, t] of labels) {
				const p = project(v, R, c);
				ctx.fillStyle = `rgba(${INK},${depthAlpha(p[2], 0.95)})`;
				ctx.fillText(t, p[0], p[1]);
			}

			// The state.
			const sv = toVec(theta, phi);
			const sp = project(sv, R, c);
			const o = project([0, 0, 0], R, c);
			ctx.lineWidth = 1;
			line([0, 0, 0], [sv[0], sv[1], 0], R, 0.5, c, [3, 3]);
			line([sv[0], sv[1], 0], sv, R, 0.5, c, [3, 3]);

			// Trail.
			trail = trail.filter((p) => now - p.t < 700);
			for (let i = 1; i < trail.length; i++) {
				const a = project(trail[i - 1].v, R, c);
				const b = project(trail[i].v, R, c);
				ctx.strokeStyle = `rgba(254,68,61,${0.45 * (1 - (now - trail[i].t) / 700)})`;
				ctx.lineWidth = 2 * s;
				ctx.beginPath();
				ctx.moveTo(a[0], a[1]);
				ctx.lineTo(b[0], b[1]);
				ctx.stroke();
			}

			ctx.globalAlpha = sp[2] < -0.05 ? 0.55 : 1;
			ctx.strokeStyle = RED;
			ctx.lineWidth = 2.2 * s;
			ctx.beginPath();
			ctx.moveTo(o[0], o[1]);
			ctx.lineTo(sp[0], sp[1]);
			ctx.stroke();

			// The dot borrows the red sphere and its two glints from the ISAQC logo.
			const r = 9 * s;
			ctx.fillStyle = RED;
			ctx.beginPath();
			ctx.arc(sp[0], sp[1], r, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.arc(sp[0] - r * 0.3, sp[1] - r * 0.42, r * 0.2, 0, Math.PI * 2);
			ctx.arc(sp[0] + r * 0.12, sp[1] - r * 0.08, r * 0.14, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;

			// Collapse ripple.
			if (ripple) {
				const k = (now - ripple.t0) / 900;
				if (k >= 1) ripple = null;
				else {
					const p = project(ripple.at, R, c);
					ctx.strokeStyle = `rgba(254,68,61,${(1 - k) * 0.8})`;
					ctx.lineWidth = 1.5;
					ctx.beginPath();
					ctx.arc(p[0], p[1], r + k * 46 * s, 0, Math.PI * 2);
					ctx.stroke();
				}
			}
		}

		function frame(now: number) {
			raf = 0;
			if (!visible || document.hidden) return;
			const dt = Math.min(50, now - last);
			last = now;
			if (!dragging && !reduced) yaw += dt * 0.00011;

			if (tween) {
				const k = Math.min(1, (now - tween.t0) / tween.dur);
				const e = easeOutBack(k);
				const v: V = [0, 1, 2].map((i) => tween!.from[i] + (tween!.to[i] - tween!.from[i]) * e) as V;
				setFromVec(v);
				trail.push({ v: toVec(theta, phi), t: now });
				if (k >= 1) {
					setFromVec(tween.to);
					tween = null;
				}
			}

			if (size) draw(now);
			raf = requestAnimationFrame(frame);
		}

		const onVisibility = () => {
			if (!document.hidden && visible && !raf) {
				last = performance.now();
				raf = requestAnimationFrame(frame);
			}
		};
		document.addEventListener('visibilitychange', onVisibility);

		function onDown(e: PointerEvent) {
			if (tween) return;
			dragging = true;
			canvas.setPointerCapture(e.pointerId);
			move(e);
		}
		function move(e: PointerEvent) {
			if (!dragging) return;
			setFromVec(fromPointer(e));
			trail.push({ v: toVec(theta, phi), t: performance.now() });
			if (lastBasis !== null) {
				lastBasis = null;
				message = 'A fresh superposition. Pick a basis and measure it.';
			}
		}
		function onUp() {
			dragging = false;
		}

		canvas.addEventListener('pointerdown', onDown);
		canvas.addEventListener('pointermove', move);
		canvas.addEventListener('pointerup', onUp);
		canvas.addEventListener('pointercancel', onUp);

		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});

	function onKey(e: KeyboardEvent) {
		const step = 0.09;
		if (e.key === 'ArrowUp') theta = Math.max(0, theta - step);
		else if (e.key === 'ArrowDown') theta = Math.min(Math.PI, theta + step);
		else if (e.key === 'ArrowLeft') phi -= step;
		else if (e.key === 'ArrowRight') phi += step;
		else if (e.key === 'Enter' || e.key === ' ') measure();
		else return;
		e.preventDefault();
	}
</script>

<figure class="bloch">
	<canvas
		bind:this={canvas}
		tabindex="0"
		aria-label="An interactive Bloch sphere. Drag, or use the arrow keys, to move the qubit. Press Enter to measure it."
		onkeydown={onKey}
	></canvas>

	<div class="panel">
		<div class="row top">
			<div class="basis" role="radiogroup" aria-label="Measurement basis">
				{#each ['Z', 'X'] as const as b}
					<button role="radio" aria-checked={basis === b} class:on={basis === b} onclick={() => (basis = b)}>
						{b} basis
					</button>
				{/each}
			</div>
			<div class="actions">
				<button class="icon" onclick={reset} aria-label="Reset the qubit" title="Reset">
					<RotateCcw size={18} strokeWidth={1.75} />
				</button>
				<button class="measure" onclick={measure}>
					<Eye size={18} strokeWidth={1.75} />
					Measure
				</button>
			</div>
		</div>

		<div class="bars" aria-label="Outcome probabilities">
			<div class="bar">
				<span class="k">{names[0]}</span>
				<span class="track"><i style:transform="scaleX({pFirst})"></i></span>
				<span class="v">{pct(pFirst)}</span>
			</div>
			<div class="bar">
				<span class="k">{names[1]}</span>
				<span class="track"><i style:transform="scaleX({1 - pFirst})"></i></span>
				<span class="v">{pct(1 - pFirst)}</span>
			</div>
		</div>

		<p class="msg" aria-live="polite">{message}</p>
	</div>
</figure>

<style>
	.bloch {
		display: grid;
		gap: 8px;
		width: 100%;
	}

	canvas {
		width: 100%;
		aspect-ratio: 1;
		cursor: grab;
		touch-action: pan-y;
		border-radius: 50%;
	}

	canvas:active {
		cursor: grabbing;
	}

	.panel {
		display: grid;
		gap: 16px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}

	.basis {
		display: inline-flex;
		padding: 3px;
		border: 1px solid var(--line);
		border-radius: 999px;
	}

	.basis button {
		height: 36px;
		padding: 0 16px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-2);
		transition:
			background 0.3s var(--ease),
			color 0.3s var(--ease);
	}

	.basis button.on {
		background: var(--ink);
		color: var(--paper);
	}

	.actions {
		display: inline-flex;
		gap: 8px;
	}

	.icon,
	.measure {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 42px;
		border-radius: 999px;
		font-weight: 600;
		font-size: 15px;
		transition:
			background 0.3s var(--ease),
			color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.icon {
		width: 42px;
		border: 1px solid var(--line);
		background: transparent;
	}

	.icon:hover {
		border-color: var(--ink);
	}

	.measure {
		padding: 0 18px;
		border: 1px solid var(--red);
		background: var(--red);
		color: #fff;
	}

	.measure:hover {
		background: var(--ink);
		border-color: var(--ink);
	}

	.bars {
		display: grid;
		gap: 8px;
	}

	.bar {
		display: grid;
		grid-template-columns: 36px 1fr 44px;
		align-items: center;
		gap: 12px;
		font-size: 14px;
		font-weight: 600;
	}

	.track {
		height: 6px;
		border-radius: 999px;
		background: var(--paper-2);
		overflow: hidden;
	}

	.track i {
		display: block;
		height: 100%;
		background: var(--ink);
		transform-origin: left;
		transition: transform 0.25s var(--ease);
	}

	.bar:first-child .track i {
		background: var(--red);
	}

	.v {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.msg {
		min-height: 3.2em;
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-2);
	}
</style>
