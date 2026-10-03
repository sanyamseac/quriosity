import { event } from './config.ts';

// The site is static and was built before the deadline, so the cut-off has to be checked in the
// browser. One shared clock ticks until submissions close, then stops.
const closeAt = Date.parse(event.submissionsClose);

let now = $state(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

function start() {
	if (timer || typeof window === 'undefined' || now >= closeAt) return;
	timer = setInterval(() => {
		now = Date.now();
		if (now >= closeAt) {
			clearInterval(timer);
			timer = undefined;
		}
	}, 1000);
}

export const submissions = {
	get closed() {
		start();
		return now >= closeAt;
	}
};
