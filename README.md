# quriosity

The website for **quriosity**, the quantum game development event by ISAQC at Infinium 2026, IIIT Hyderabad.

Built with SvelteKit 3 and Svelte 5, prerendered into a fully static site.

## Develop

```sh
npm install
npm run dev
```

## Deploy on Cloudflare Pages

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `build` |
| Node version | 22 or newer (`NODE_VERSION` environment variable) |

`static/_headers` sets long cache lifetimes for fonts and hashed assets. Unknown paths fall back to `404.html`.

## Submissions (ratufa.io)

The form on `/submit` posts to ratufa.io. Its loader script is set in `ratufaLoaderSrc` in `src/lib/config.ts`, and ratufa attaches itself to the only `<form>` on that page.

To close submissions, set `ratufaLoaderSrc` to `''` and redeploy. The page then shows a notice and does not submit.

Fields sent: `team_name`, `option`, `game_link`, `repository_link`, `video_link`, `usage_consent`, `notes`.

## Where things live

- `src/lib/config.ts` holds event times, prizes, links and the ratufa script.
- `src/lib/content.ts` holds all of the copy: options, rules, timeline, deliverables and questions.
- `src/routes/discord/+page.svelte` is the full screen Discord invite with its QR code, which you can save as PNG or SVG.
- `src/routes/slides/+page.svelte` is the Alice and Bob deck, with its copy in `slides` inside `content.ts`.
- `src/lib/components/BlochSphere.svelte` is the interactive qubit in the hero.
- `static/fonts/Quantum.otf` is the self-hosted copy of the display face, with a `woff2` build next to it.

## Type rules

Display lettering uses **Quantum**; everything else uses **Quicksand**. Quantum only has letters, digits, spaces, `!` and `?`, and all display text is shown in lowercase, so keep titles free of other punctuation.
