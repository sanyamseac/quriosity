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

// Paste the full `src` of the script tag that ratufa.io gives you for the
// submission form, for example:
//   https://www.ratufa.io/c/ld.js?f=XXXXXXXX&n=XXXXXXXX&i=quriosity-submission
// While this is empty, the submission page explains that the form is not live yet.
export const ratufaLoaderSrc = '';

export const links = {
	isaqc: 'https://isaqc-official.github.io/',
	github: 'https://github.com/isaqc-official',
	instagram: 'https://instagram.com/isaqc.official',
	email: 'isaqc@students.iiit.ac.in',
	discord: 'https://discord.gg/gmtjFgKKk',
	discordLabel: 'discord.gg/gmtjFgKKk',
	infinium: 'https://felicity.iiit.ac.in/infinium/events'
};
