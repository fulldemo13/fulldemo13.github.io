# AGENTS.md

## Project

Multi-tool static site hosted on GitHub Pages (`fulldemo13.github.io`). Each tool lives in its own subfolder as an independent static site. The root is a landing page listing all tools.

### Structure

```
/
├── index.html          — Landing page (tool list)
├── style.css           — Landing page styles
├── README.md           — Repo README
├── AGENTS.md           — This file
├── bingo/
│   ├── index.html      — Bingo Musical generator form
│   ├── app.js          — All bingo logic
│   ├── style.css       — Bingo styles + print
│   ├── spin-record.gif — Vendored footer logo
│   └── README.md       — Bingo-specific README
└── (future tools)/
```

## Language

All user-facing text (HTML labels, JS strings, tool READMEs) must be in **Valencian**. The landing page and AGENTS.md are in English/Vaencian as appropriate. AGENTS.md is in English to save tokens.

## Stack

- Pure static sites — no npm, no bundler, no framework
- Local dev: `docker compose up` → http://localhost:8080 (or `python3 -m http.server 8080`)
  - Landing page: http://localhost:8080/
  - Bingo: http://localhost:8080/bingo/
- Deploy: push to `main`, GitHub Pages serves it

## Bingo Musical (`bingo/`)

Users paste a list of song titles, choose how many cards to generate, select card size (1–12 per A4 page), pick fonts and colors, and print them for a live musical bingo game.

### Architecture

- `app.js` — all logic: validation, dedup, duplicate warning, Fisher-Yates shuffle, uniqueness check (C(n,9) limit), grid size calculation (`calculateGrid()`), overflow detection (`checkOverflow()` via `document.fonts.ready`), rendering with dynamic inline styles
- `style.css` — GitHub-inspired form styling, A4-proportioned yellow preview page, `@media print` layouts with explicit A4 dimensions; CSS custom properties for colors and fonts
- `index.html` — single-page form with: textarea, number input (card count), select (card size), title input, two font selectors (title + cell with live preview via `style.fontFamily`), three color pickers (header, odd cells, even cells), generate/print buttons

### Conventions

- Each card is a 4×3 CSS grid (header row spanning 3 cols + 3×3 bingo cells), `aspect-ratio: 1/1`
- Card size selector maps to cards-per-page values (1, 2, 4, 6, 12); `calculateGrid()` picks optimal cols×rows for A4 and computes `cardSize` in mm
- Card layout uses `display: contents` on `<main>` so cells participate directly in the card grid
- Font selectors: title fonts are cursive/display families; cell fonts include generic + Google Fonts. `quoteFont()` wraps non-generic names in quotes for CSS custom properties
- Default title: "Bingo Benitandús fest" (when title field is empty)
- Colors use CSS custom properties (`--header-color`, `--cell-odd-color`, `--cell-even-color`, `--title-font`, `--cell-font`) set as inline styles on each `.card`
- Overflow detection: after rendering, `checkOverflow()` (via `document.fonts.ready`) checks title ellipsis and cell scroll overflow; print blocks if errors exist
- Card numbers are 1-indexed (`n.` prefix)
- Print CSS: white background, `@page { size: A4 portrait; margin: 0; }`, `width: 210mm; height: 297mm;` on `.page`

### Gotchas

- `html lang="en"` but all text is Valencian — keep it that way unless intentionally changing
- The app.js error messages are in Valencian; match their register if adding new ones
- `spin-record.gif` is vendored (footer logo), not generated
- Google Fonts are loaded via `@import` in CSS — any new font must be added to that import URL too
- The `.page` grid uses inline styles for `grid-template-columns/rows` with `--card-size` in mm, set by JS

## Adding a new tool

1. Create a new subfolder at the repo root (e.g. `nou-eina/`)
2. Add a link card to the root `index.html` in the `.tools` div
3. Each tool is fully self-contained: its own `index.html`, `app.js`, `style.css`, etc.
4. Update this AGENTS.md with the new tool's section