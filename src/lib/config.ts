// Everything the organisers might need to change lives here.

export const event = {
	name: 'quriosity',
	tagline: 'Quantum game development',
	organiser: 'ISAQC',
	organiserFull: 'IIIT Society for Applied Quantum Computing',
	festival: 'Infinium 2026',
	host: 'Felicity, IIIT Hyderabad',
	venue: 'H204, IIIT Hyderabad',
	room: 'H204',

	// All times are India Standard Time (UTC+05:30).
	kickoff: '2026-10-03T10:30:00+05:30',
	// Sixteen hours after kickoff. Confirm with the core team before the event.
	sprintEnd: '2026-10-04T02:30:00+05:30',
	close: '2026-10-04T06:00:00+05:30',

	teamSize: 4,
	prizes: [
		{ place: 'First', amount: 14000 },
		{ place: 'Second', amount: 7000 },
		{ place: 'Third', amount: 4000 }
	]
};

// The `src` of the script tag ratufa.io gives you for the submission form. ratufa attaches to the
// only <form> on /submit. Set this to '' to close submissions; the page then shows a notice instead.
export const ratufaLoaderSrc = 'https://www.ratufa.io/c/ld.js?f=bq7eyc5a&n=n1.ratufa.io';

export const links = {
	isaqc: 'https://isaqc-official.github.io/',
	github: 'https://github.com/isaqc-official',
	instagram: 'https://instagram.com/isaqc.official',
	email: 'isaqc@students.iiit.ac.in',
	discord: 'https://discord.gg/gmtjFgKKk',
	discordLabel: 'discord.gg/gmtjFgKKk',
	infinium: 'https://felicity.iiit.ac.in/infinium/events'
};
