// Reads resources/submissions.csv (the ratufa export) at build time. Replace that file and rebuild
// to refresh the /submissions page.
import raw from '../../resources/submissions.csv?raw';
import { tracks } from './content.ts';

export interface Submission {
	team: string;
	option: { n: string; title: string };
	game: string;
	repo: string;
	video: string | null;
	submittedAt: Date;
}

// Minimal RFC 4180 parser: handles quoted fields, escaped quotes and newlines inside quotes.
function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let quoted = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (quoted) {
			if (c === '"' && text[i + 1] === '"') {
				field += '"';
				i++;
			} else if (c === '"') quoted = false;
			else field += c;
		} else if (c === '"') quoted = true;
		else if (c === ',') {
			row.push(field);
			field = '';
		} else if (c === '\n' || c === '\r') {
			if (c === '\r' && text[i + 1] === '\n') i++;
			row.push(field);
			if (row.some((f) => f.trim())) rows.push(row);
			row = [];
			field = '';
		} else field += c;
	}
	row.push(field);
	if (row.some((f) => f.trim())) rows.push(row);
	return rows;
}

const clean = (url: string) => url.trim().replace(/\.git$/, '').replace(/\/$/, '');

// A team that pasted its GitHub Pages site instead of its repository: point at the repository.
function repoFrom(url: string) {
	const pages = clean(url).match(/^https?:\/\/([\w-]+)\.github\.io\/([^/?#]+)/i);
	return pages ? `https://github.com/${pages[1]}/${pages[2]}` : clean(url);
}

// Placeholder videos, or a "video" that is just the game or repository again, count as missing.
function videoFrom(url: string, game: string, repo: string) {
	const v = clean(url);
	if (!v || /^https?:\/\/(www\.)?example\.com/i.test(v)) return null;
	if (v === clean(game) || v === clean(repo)) return null;
	return url.trim();
}

const [header, ...body] = parseCsv(raw);
const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
const at = { date: col('date'), team: col('team_name'), option: col('option'), game: col('game_link'), repo: col('repository_link'), video: col('video_link') };

export const submissions: Submission[] = body
	.map((r) => {
		const optionRaw = r[at.option]?.trim() ?? '';
		const n = optionRaw.slice(0, 2);
		const track = tracks.find((t) => t.n === n);
		const game = r[at.game]?.trim() ?? '';
		const repo = repoFrom(r[at.repo] ?? '');
		return {
			team: r[at.team].trim(),
			option: { n, title: track?.title ?? optionRaw.slice(3) },
			game,
			repo,
			video: videoFrom(r[at.video] ?? '', game, repo),
			// "2026-10-03 21:35:23.560 +0000 UTC" → ISO
			submittedAt: new Date(r[at.date].replace(/^(\S+) (\d\d:\d\d:\d\d)\S* \+0000 UTC$/, '$1T$2Z'))
		};
	})
	// Grouped by option, then alphabetical. Deliberately not by time, so the order implies no ranking.
	.sort((a, b) => a.option.n.localeCompare(b.option.n) || a.team.localeCompare(b.team, 'en', { sensitivity: 'base' }));
