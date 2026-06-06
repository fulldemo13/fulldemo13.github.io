# AGENTS.md

## Project

Static **musical bingo** card generator (no build system). Users paste a list of song titles, choose how many cards to generate, select card size (1–12 per A4 page), pick fonts and colors, and print them for a live musical bingo game. Hosted on GitHub Pages (`fulldemo13.github.io`).

## Language

All user-facing text (HTML labels, JS strings, README) must be in **Valencian**. AGENTS.md is in English to save tokens.

## Stack

- Pure static site: `index.html` + `app.js` + `style.css`
- No npm, no bundler, no framework
- Local dev: `docker compose up` → http://localhost:8080
- Deploy: push to `main`, GitHub Pages serves it

## Architecture

- `app.js` — all logic: validation, dedup, duplicate warning, Fisher-Yates shuffle, uniqueness check (C(n,9) limit), grid size calculation, overflow detection (`document.fonts.ready`), rendering with dynamic styles
- `style.css` — GitHub-inspired form styling, A4-proportioned yellow preview page, `@media print` layouts with explicit A4 dimensions; CSS custom properties for colors and fonts
- `index.html` — single-page form with: textarea, number input (card count), select (card size in mm), title input, two font selectors (title + cell with live preview via `style.fontFamily`), three color pickers (header, odd cells, even cells), generate/print buttons

## Conventions

- Each card is a 4×3 CSS grid (header row spanning 3 cols + 3×3 bingo cells), with `aspect-ratio: 1/1`
- Card size selector maps to cards-per-page values (1, 2, 4, 6, 12); `calculateGrid()` picks optimal cols×rows for A4 and computes `cardSize` in mm for inline grid styles
- Card layout uses `display: contents` on `<main>` so cells participate directly in the card grid
- Font selectors: title fonts are cursive/display families; cell fonts include generic + Google Fonts. `quoteFont()` wraps non-generic names in quotes for CSS custom properties
- Default title: "Bingo Benitandús fest" (when title field is empty)
- Uniqueness is enforced via sorted signature strings in a Set; max 100k retries before error
- Duplicate songs in input are removed with a warning shown in red
- Overflow detection: after rendering, `checkOverflow()` (called via `document.fonts.ready`) checks title ellipsis and cell scroll overflow, reports truncated song names
- Print: blocks if overflow errors exist; recalculates on every click
- `select` elements for fonts update their `style.fontFamily` on change to preview the selected font
- Card numbers are 1-indexed (`n.` prefix)
- Print CSS: white background, `@page { size: A4 portrait; margin: 0; }`, `width: 210mm; height: 297mm;` on `.page`

## Gotchas

- `html lang="en"` but all text is Valencian — keep it that way unless intentionally changing
- `style.css` comments are partially in Spanish — new comments should be in Valencian or English
- The app.js error messages are in Valencian; match their register if adding new ones
- `spin-record.gif` is vendored (footer logo), not generated
- Google Fonts are loaded via `@import` in CSS — any new font must be added to that import URL too
- CSS custom properties for colors (`--header-color`, `--cell-odd-color`, `--cell-even-color`) and fonts (`--title-font`, `--cell-font`) are set as inline styles on each `.card` element
- The `.page` grid uses inline styles for `grid-template-columns/rows` with `--card-size` in mm, set by JS based on the selected card size