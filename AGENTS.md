# AGENTS.md

## Project

Static **musical bingo** card generator (no build system). Users paste a list of song titles, choose how many 3x3 cards to generate and how many per page (default 6), and print them for a live musical bingo game where the host plays song clips and players mark them on their cards. Hosted on GitHub Pages (`fulldemo13.github.io`).

## Language

All user-facing text (HTML labels, JS strings, README) must be in **Valencian**. AGENTS.md is in English to save tokens.

## Stack

- Pure static site: `index.html` + `app.js` + `style.css`
- No npm, no bundler, no framework
- Local dev: `docker compose up` → http://localhost:8080
- Deploy: push to `main`, GitHub Pages serves it

## Architecture

- `app.js` — all logic: validation, Fisher-Yates shuffle, uniqueness check (C(n,9) limit), grid layout calculation (optimal cols×rows for A4), rendering
- `style.css` — screen (A4-proportioned yellow preview) + `@media print` layouts; dynamic grid via inline styles set by JS
- `index.html` — single-page form with textarea, number inputs (cards count, cards per page), title input, generate/print buttons

## Conventions

- Each card is a 4×3 CSS grid (header row spanning 3 cols + 3×3 bingo cells), with `aspect-ratio: 1/1` making the whole card square
- Cards per page is configurable (default 6); `calculateGrid()` picks optimal cols×rows for A4 portrait
- Card layout uses `display: contents` on `<main>` so cells participate directly in the card grid
- Default title: "Bingo Benitandús fest" (when title field is empty)
- Uniqueness is enforced via sorted signature strings in a Set; max 100k retries before error
- Card numbers are 1-indexed (`n.` prefix)
- Print CSS hides `#settings`, `.site-header`, `.site-footer` and forces `page-break-after: always` on `.page`

## Gotchas

- `html lang="en"` but all text is Valencian — keep it that way unless intentionally changing
- `style.css` comments are partially in Spanish — new comments should be in Valencian or English
- The app.js error messages are in Valencian; match their register if adding new ones
- `spin-record.gif` is vendored (footer logo), not generated