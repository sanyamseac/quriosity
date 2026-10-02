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

## Turning on submissions (ratufa.io)

The form on `/submit` is a plain HTML form with the id `quriosity-submission`. ratufa binds to it through its loader script.

1. Create a form on ratufa.io and copy the `src` of the script tag it gives you.
2. Paste it into `ratufaLoaderSrc` in `src/lib/config.ts`. If ratufa asks for a form id, use `quriosity-submission`.
3. Rebuild and deploy. While `ratufaLoaderSrc` is empty, the page shows a notice and does not submit.

Fields sent: `team_name`, `members`, `email`, `option`, `game_link`, `repository_link`, `video_link`, `usage_consent`, `notes`.

## Where things live

- `src/lib/config.ts` holds event times, prizes, links and the ratufa script.
- `src/lib/content.ts` holds all of the copy: options, rules, timeline, deliverables and questions.
- `src/routes/discord/+page.svelte` is the full screen Discord invite with its QR code, which you can save as PNG or SVG.
- `src/routes/slides/+page.svelte` is the Alice and Bob deck, with its copy in `slides` inside `content.ts`.
- `src/lib/components/BlochSphere.svelte` is the interactive qubit in the hero.
- `static/fonts/Quantum.otf` is the self-hosted copy of the display face, with a `woff2` build next to it.

## Type rules

Display lettering uses **Quantum**; everything else uses **Quicksand**. Quantum only has letters, digits, spaces, `!` and `?`, and all display text is shown in lowercase, so keep titles free of other punctuation.
