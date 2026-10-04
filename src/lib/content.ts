// Site copy. In section titles, "|" marks a line break.
// Anything rendered in the Quantum display face (titles, labels marked `display`)
// must only use letters, digits, spaces, "!" and "?", because the font has no other glyphs.

export interface Track {
	n: string;
	title: string; // display
	subtitle: string;
	plain: string;
	principle: string;
	mechanism: string;
	ideas: string[];
}

export const concepts = [
	'Superposition',
	'Measurement',
	'Entanglement',
	'Interference',
	'Phase kickback',
	'Unitary gates',
	'Amplitude',
	'Bell states',
	'Error correction',
	'Collapse'
];

export const dialogue = [
	{
		who: 'Alice',
		line: 'Hello. I am Alice, and this year we are making games where you learn quantum physics completely by accident.'
	},
	{
		who: 'Bob',
		line: 'And I am Bob. By accident, yes. Nobody opens a textbook at midnight, but everybody plays one more round.'
	},
	{
		who: 'Alice',
		line: 'So the brief is simple. Someone finishes your game, and something in their head quietly clicks.'
	},
	{
		who: 'Bob',
		line: 'That little "ohhh, so that is how it works" moment. That is what we are chasing all night.'
	}
];

export const principles = [
	{
		title: 'Learn by playing',
		body: 'The whole point, in one line: somebody plays your game and walks away genuinely understanding a quantum idea. No lecture, no quiz at the end. The fun is the lesson.'
	},
	{
		title: 'Topic first',
		body: 'Please do not lose ten hours to glossy 3D models or clever shaders. A plain square that teaches something true beats a gorgeous game that teaches nothing. Clear and correct wins. Pretty is a bonus.'
	},
	{
		title: 'Build around the idea',
		body: 'Not an ordinary game with the word quantum printed on the box. The mechanics and the win conditions have to grow out of real phenomena: superposition, collapse, entanglement, gates. Pull the physics out and the game should fall apart.'
	},
	{
		title: 'Welcome beginners',
		body: 'If a player needs a physics degree, we have already lost them. High school maths and science should be plenty. Keep heavy notation out of sight, unless the gameplay itself explains it the way a patient friend would.'
	},
	{
		title: 'Learn Struggle Build',
		body: 'Spend the first few hours on a topic your team does not fully understand yet. Notice the exact moment it stops making sense. That moment is gold. Then build the game that clears it up for the next person.'
	},
	{
		title: 'Original only',
		body: 'No clones, no reskins of quantum games that already exist. Bring your own twist, or better still, a mechanic nobody has dreamt up before.'
	},
	{
		title: 'Easy to run',
		body: 'Any platform is welcome, as long as the judges can get your game running without a fight. A hosted link or a direct executable is preferred: one click and they are playing. Long setup instructions are where good games go to be forgotten.'
	}
];

export const tracks: Track[] = [
	{
		n: '01',
		title: 'Basis Switching',
		subtitle: 'and measurement scrambling',
		plain:
			'Looking at a qubit is never innocent. Ask it the wrong question and it forgets the answer to the right one.',
		principle:
			'Observing a quantum system means choosing a measurement basis first. A qubit resting in |0⟩ or |1⟩, measured in the computational Z basis, gives the same answer every single time.',
		mechanism:
			'Measure that very same qubit in the diagonal X basis, the one built from |+⟩ and |−⟩, and the outcome becomes a perfect coin toss. The original information is erased for good, simply because somebody inspected it along the incompatible axis.',
		ideas: ['Conjugate measurement bases', 'Projection operators', 'State collapse', 'Basis incompatibility']
	},
	{
		n: '02',
		title: 'Deutsch Jozsa',
		subtitle: 'the parity oracle',
		plain:
			'A sealed box hides a rule. Classical players have to keep knocking. Quantum players knock exactly once.',
		principle:
			'A black box function f(x) takes binary strings and answers 0 or 1. It is promised to be either constant, giving the same output everywhere, or balanced, giving 0 for precisely half of the inputs. A classical solver can need 2ⁿ⁻¹ + 1 queries in the worst case to be certain which.',
		mechanism:
			'Feed the oracle a superposition of every input at once and let phase kickback do its quiet work: U_f|x⟩|−⟩ = (−1)^f(x) |x⟩|−⟩. The many paths interfere, and when the function is balanced they cancel completely. One single query settles the whole question.',
		ideas: ['Phase kickback', 'Walsh–Hadamard transform', 'Global parity interference', 'Quantum speedup']
	},
	{
		n: '03',
		title: 'Unitary Gates',
		subtitle: 'and reversible flow',
		plain: 'Every move can be undone. That is not a cheat code, it is a law of nature.',
		principle:
			'Classical gates such as AND and OR throw information away, so there is no recovering what went in. Quantum gates, as long as nobody measures, are unitary: U†U = I. Evolution is strictly reversible, and the state never shrinks or swells on the Bloch sphere.',
		mechanism:
			'The bit flip X, the phase flip Z and the Hadamard H each rotate the state vector in a precise, predictable way. Any sequence of them can be wound back step by step, or walked through in reverse like a film played backwards.',
		ideas: ['Bloch sphere coordinates', 'Single qubit unitaries', 'Reversibility', 'State vector trajectories']
	},
	{
		n: '04',
		title: 'Amplitude Amplification',
		subtitle: 'the Grover search',
		plain:
			'Find the needle in the haystack by making the needle louder, one careful step at a time. Overdo it and the needle goes quiet again.',
		principle:
			'Classically, finding one marked item among N unsorted ones takes on the order of N checks. A quantum computer can find it in roughly √N steps, without testing the items one after another.',
		mechanism:
			'Two moves on repeat. First, an oracle flips the sign of the marked state. Then a diffusion operator, 2|s⟩⟨s| − I, reflects every amplitude about the average. The target grows while everything else fades. Keep going past the sweet spot, though, and the rotation overshoots and accuracy slips away.',
		ideas: ['Oracle phase marking', 'Inversion about the mean', 'Amplitude reflection', 'Rotation angle cycles']
	},
	{
		n: '05',
		title: 'Superdense Coding',
		subtitle: 'two bits, one qubit',
		plain: 'Send two bits by posting a single qubit. The secret ingredient is a friend you entangled with earlier.',
		principle:
			'Holevo’s theorem says a lone qubit can carry at most one classical bit once it is measured. Shared entanglement quietly breaks through that ceiling.',
		mechanism:
			'Two players share a Bell pair, |Φ⁺⟩ = (|00⟩ + |11⟩) / √2. The sender applies one of four local operations, I, X, Z or XZ, to their own qubit alone and sends it across. The receiver decodes one of 00, 01, 10 or 11. Two whole bits, one physical qubit.',
		ideas: ['The four Bell states', 'Local Pauli operations', 'Entangled subsystems', 'Bell basis measurement']
	},
	{
		n: '06',
		title: 'Error Syndromes',
		subtitle: 'and parity probes',
		plain: 'Repair a broken message without ever reading it. Sounds impossible, which is exactly the fun.',
		principle:
			'Noise from the environment causes bit flips (X) and phase flips (Z) on fragile quantum states. Keeping three copies as a backup is off the table, because the no-cloning theorem forbids |ψ⟩ → |ψψψ⟩.',
		mechanism:
			'Spread the data across an entangled register of several qubits. Helper ancilla qubits interact with that register through CNOT gates to run indirect parity checks. Measuring only the ancillas reveals where an error struck and what kind it was, without ever measuring, projecting or disturbing the protected superposition itself.',
		ideas: ['Three qubit flip codes', 'Ancilla syndrome extraction', 'Non-destructive parity checks', 'Stabilizer corrections']
	}
];

export const timeline = [
	{
		when: '3 October, 10:30',
		title: 'Kickoff',
		body: 'Doors open in H204. The options are walked through, teams settle in, and everybody picks the one that calls to them.'
	},
	{
		when: 'Hours 0 to 3',
		title: 'Learn',
		body: 'Research a topic that confuses you. Write down every "wait, what?" moment, because your README will ask about them later.'
	},
	{
		when: 'Hours 3 to 16',
		title: 'Struggle and Build',
		body: 'Turn that confusion into a mechanic. Prototype, break it, playtest it on whoever is still awake, repeat.'
	},
	{
		when: 'Hour 16',
		title: 'Submit',
		body: 'The sprint closes. Hand in all five deliverables through the submission form.'
	},
	{
		when: 'Before 06:00, 4 October',
		title: 'Finals',
		body: 'Finalists present their games to a panel of domain experts, and the night finally gets to end.'
	}
];

export const deliverables = [
	{ title: 'Your option', body: 'Name the option your whole game is built around.' },
	{ title: 'A playable game', body: 'A hosted link or a direct executable, whichever runs most easily.' },
	{ title: 'A public repository', body: 'All of the source code, out in the open.' },
	{ title: 'A short video', body: 'Your team playing the game, with the core mechanic clearly in action.' },
	{
		title: 'A README write-up',
		body: 'What your team learned about the topic in the first three hours, and how that idea became the beating heart of the game.'
	}
];

export const values = [
	'The physics is accurate and easy to follow',
	'The core mechanic comes straight from the quantum idea',
	'A beginner can pick it up and understand it',
	'The idea is genuinely your own',
	'It is easy to get running, hosted or as a direct executable'
];

export const faqs = [
	{
		q: 'Do I need to know quantum computing already?',
		a: 'Not at all. The guidelines actually encourage picking a topic your team does not fully understand yet. Confusion is the raw material here.'
	},
	{
		q: 'How large can a team be?',
		a: 'Come alone, or bring up to three friends. Four people is the limit. Mixed teams of programmers, designers and physics enthusiasts tend to do rather well.'
	},
	{
		q: 'Which engine or language should we use?',
		a: 'Whatever you are fastest in. Unity, Godot, Unreal and plain web code are all fair game, and Qiskit or Cirq are welcome for the quantum logic if you want a real simulator underneath.'
	},
	{
		q: 'Which platforms are allowed?',
		a: 'Any of them. Browser, desktop and mobile games are all welcome, as long as they run without a struggle. A hosted link or a direct executable is preferred, so the judges can start playing straight away.'
	},
	{
		q: 'Can we combine two options?',
		a: 'No. Pick one option and wrap the entire game around it. Depth beats breadth tonight.'
	},
	{
		q: 'Can we remake a quantum game we love?',
		a: 'Please do not. Clones and direct copies are out. Borrow inspiration if you must, but the central mechanic has to be your own.'
	},
	{
		q: 'How are the winners chosen?',
		a: 'In two stages. Everything submitted after the sixteen hour sprint is reviewed, and the finalists then present to a panel of domain experts. Every submission must show a meaningful link between its gameplay and its chosen option.'
	}
];

// The Alice and Bob deck on /slides. `title` is set in the display face.
export type Speaker = 'Alice' | 'Bob';

export interface Slide {
	tag: string;
	title: string;
	sub?: string;
	chat: { who: Speaker; line: string }[];
	chips?: { icon: string; label: string }[];
}

export const slides: Slide[] = [
	{
		tag: 'quriosity',
		title: 'Play first|Understand later',
		sub: 'Alice and Bob walk you through what quriosity is all about.',
		chat: [
			{ who: 'Alice', line: 'Hello! I am Alice. We are making games where you accidentally learn quantum physics.' },
			{
				who: 'Bob',
				line: 'And I am Bob. Yes, accidentally. Nobody reads a textbook at midnight, but everybody plays a game.'
			}
		],
		chips: [
			{ icon: 'atom', label: 'Physics' },
			{ icon: 'dices', label: 'Play' },
			{ icon: 'gamepad', label: 'Games' }
		]
	},
	{
		tag: 'The goal',
		title: 'Learn by playing',
		chat: [
			{ who: 'Alice', line: 'The goal is simple: a player finishes your game and suddenly gets a quantum idea.' },
			{ who: 'Bob', line: 'No lecture. No quiz at the end. The fun is the lesson.' },
			{ who: 'Alice', line: 'That "ohhh, so that is how it works" feeling is exactly what we are chasing.' }
		]
	},
	{
		tag: 'Priorities',
		title: 'Idea first|Graphics second',
		chat: [
			{ who: 'Bob', line: 'Please do not spend ten hours on shiny 3D models.' },
			{ who: 'Alice', line: 'A plain square that teaches something true beats a gorgeous game that teaches nothing.' },
			{ who: 'Bob', line: 'Clear and correct wins. Pretty is a bonus.' }
		]
	},
	{
		tag: 'The heart of it',
		title: 'Build the game|around the idea',
		chat: [
			{ who: 'Alice', line: 'Not a normal game with the word quantum stuck on it.' },
			{
				who: 'Bob',
				line: 'The rules themselves should behave like the real thing. Remove the quantum idea and the game should fall apart.'
			},
			{
				who: 'Alice',
				line: 'Think of things being in two states at once, looking at something and changing it, or objects linked across a distance.'
			}
		],
		chips: [
			{ icon: 'orbit', label: 'Superposition' },
			{ icon: 'eye', label: 'Measurement' },
			{ icon: 'link', label: 'Entanglement' },
			{ icon: 'door', label: 'Gates' }
		]
	},
	{
		tag: 'Everyone is welcome',
		title: 'High school brain?|You are in',
		chat: [
			{ who: 'Bob', line: 'If a player needs a physics degree, we have lost them.' },
			{ who: 'Alice', line: 'Keep the maths light. Let the gameplay explain things the way a good friend would.' }
		]
	},
	{
		tag: 'How to start',
		title: 'Learn|Struggle|Build',
		chat: [
			{ who: 'Alice', line: 'Spend the first few hours learning something you do not fully understand yet.' },
			{ who: 'Bob', line: 'Notice what confuses you. That "wait, what?" moment is gold.' },
			{ who: 'Alice', line: 'Then build a game that clears up that exact confusion for the next person.' }
		],
		chips: [
			{ icon: 'book', label: 'Learn' },
			{ icon: 'brain', label: 'Struggle' },
			{ icon: 'hammer', label: 'Build' }
		]
	},
	{
		tag: 'Make it yours',
		title: 'Original and|easy to play',
		chat: [
			{ who: 'Bob', line: 'No clones, no copies. Bring your own twist.' },
			{
				who: 'Alice',
				line: 'And make it easy to run. A hosted link or a direct executable is perfect, so the judges can start playing in seconds.'
			},
			{ who: 'Bob', line: 'Now go make something that makes a quantum idea click. See you there!' }
		],
		chips: [{ icon: 'rocket', label: 'Go build it' }]
	}
];

// Results, announced 4 October 2026. `team` must match team_name in resources/submissions.csv;
// links and the option come from there. Screenshots live in static/img/winners/<slug>.webp.
export interface Result {
	team: string;
	slug: string;
	title: string;
	blurb: string;
}

export const podium: Result[] = [
	{
		team: 'Paradox Protocol',
		slug: 'paradox-protocol',
		title: 'No Peeking!',
		blurb:
			'A night shift at the Qubble Daycare with exactly one rule: do not peek. Keep the sleeping qubits safe through the dark without ever looking at them, which turns out to be precisely how error syndromes work.'
	},
	{
		team: 'treekeliye',
		slug: 'treekeliye',
		title: 'Nothing Is Lost',
		blurb:
			'A little story about a lantern, some levers and the one thing you cannot undo. Every gate can be turned back, step by step. Measurement is the only door that stays shut.'
	},
	{
		team: 'Ignotus',
		slug: 'ignotus',
		title: 'Null Signal',
		blurb:
			'Aboard the Astra-7 research station, a faint signal hides in the static. Amplify it, round after careful round, until something finally answers.'
	}
];

export const mentions: Result[] = [
	{
		team: 'Qubit Busters',
		slug: 'qubit-busters',
		title: 'Qubit Roll',
		blurb: 'A rolling puzzle where the state of your qubit decides what every move does, from dashing in |0⟩ to splitting into two paths at once.'
	},
	{
		team: "shor we'll participate",
		slug: 'shor-we-ll-participate',
		title: 'Qubit FC',
		blurb: 'Six a side football where every pass is a quantum gate. Build your state, beat the keeper, make the measurement.'
	},
	{
		team: 'Zenvora',
		slug: 'zenvora',
		title: 'Quantum Bunny',
		blurb: 'A pixel platformer about basis switching, with a scanner for each basis and a quantum lab for experimenting between levels.'
	}
];
