# Free Lancer Studios — Website

Live site: **freelancerstudios.solutions** (see `CNAME`). Static, deployed from this repo.

## Purpose (source of truth)

This website is a **marketing and lead-generation** asset. Every change should be evaluated against that goal:

- **Primary goal:** turn visitors into qualified leads. The conversion action is **"Start a project"** (`start.html`) — the CTA that should be reachable from every page.
- **Secondary goal:** build credibility. The portfolio, service tiers, and about content exist to make a prospect trust FLS enough to start that conversation.
- **Audience:** organizations with real constraints — churches/ministries, agencies, trade businesses, game/venture studios — evaluating whether to hire FLS for AI strategy, automation, product/engineering, or search visibility work.
- **Tone:** confident, plain-spoken, outcome-focused. Content is kept "deliberately high-level out of respect for clients"; deeper detail is offered on request rather than published.

When in doubt, favor changes that improve clarity of the offer, credibility of the work, and the path to "Start a project." Avoid vanity content that doesn't serve those.

## Tech stack

- **Build:** Vite 6 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`). Scripts: `npm run dev`, `npm run build`, `npm run preview`.
- **Entry/assets:** each page (`index.html`, `portfolio.html`, etc.) loads `/src/styles.css` and `/src/main.ts`.
  - `src/styles.css` defines Tailwind `@theme` tokens and then `@import "../styles.css"` — so the large hand-written **`styles.css` at the repo root is still the primary stylesheet** and flows into the build. Add page styles there unless they need Tailwind tokens.
  - `src/main.ts` holds the shared interactive behavior (rail nav, page toggles, forms). Page-specific one-off scripts may live inline in the page.
- **Pages:** `index` (home), `portfolio`, `services`, `about`, `contact`, `start`, `privacy`.
- **Deploy:** pushes to `main` run `.github/workflows/deploy.yml`, which type-checks, runs `npm run build` and publishes `dist/` to GitHub Pages (Pages source = "GitHub Actions"; custom domain set in Pages settings, `CNAME` copied into the artifact). `dist/` is gitignored — do not commit `dist/` or `node_modules/`. Before 2026-11-11 Pages served the raw branch, so `/src/*.ts` never ran live (forms, rail toggle and the system map were dead there).

## Conventions

- Root `styles.css` is the source of truth for styling; `src/styles.css` only adds Tailwind theme tokens on top.
- Keep `/src/styles.css` + `/src/main.ts` as the asset references in page `<head>`s — do **not** revert pages to flat `styles.css` / `script.js` (that predates the Vite migration and breaks the build).
- Client-facing content is high-level by design; link out to live client sites where they exist rather than over-describing engagements.
- **Text color scale (solid, not alpha):** `--text` `#F0ECF8` for headings; `--text-muted` `#ABA4BD` (8.2:1 on `--bg2`) for body/secondary copy; `--text-subtle` `#8F88A3` (5.8:1) for small labels. Greys are lavender-tinted to sit in the violet-black ground. Don't reintroduce `rgba(240,236,248,…)` text — alpha greys shift with whatever's behind them. Body weight is Inter **400** (300 washed out at small sizes).
- **Brand palette = the logo:** purple, gold, cyan and navy only — no green. Neon accents use `--nx-violet` / `--nx-violet-hot`, `--nx-gold`, `--nx-cyan` and `--nx-navy` (`#6a82ff`, the ribbon's navy-blue lit for the dark ground). Highlighted headline words (`.nx-glow`) are solid brand gold with a soft glow, not a gradient.
- **Sentence case, no decoration:** labels, eyebrows, nav, tags and buttons are sentence case — no `text-transform: uppercase` (the only exception is the brand wordmark: `.brand-name`, `.rail-brand-text`, `.side-brand-name`, `.ntl-name`). Don't append "→" to button or link text; an arrow is fine only where it carries meaning (e.g. "Build → ship → scale"). Keep proper nouns and tier names capitalized ("Tier 1: Compass").

## Change log

Newest first. Record notable content/structure changes here so the site's history stays legible.

### 2026-11-10 — Google Tag Manager (analytics)
- Every page loads GTM container **`GTM-5RTQPP44`**: Google's standard snippet is the first thing in `<head>`, and the `<noscript>` iframe sits right after `<body>`. GA4 and any other tags are managed **inside GTM**, not in this repo. Add the same two snippets to any new page.
- Privacy policy §4 (Cookies) now says the site uses GTM + Google Analytics analytics cookies; it no longer claims "no tracking pixels".

### 2026-11-10 — Neon revision of About, Services, Portfolio + interactive system map
- **Shared neon system** (`.nx-*` block at the end of `styles.css`, `src/neon.ts` for scroll reveals): crisp neon strokes with soft halos, smooth bezier curves and pill buttons keyed to the mark's turns. Pages add `class="js"` to `<html>` inline so reveal-hidden content still shows without JS; `prefers-reduced-motion` turns off every animation.
- **About:** neon line-art of the mark as the hero, a mission statement, four core truths ("We don't ask teams to go where we haven't been", clarity before code, "the best engagement ends", faith-first foundation), a four-step "How we work" wave, who we work with, and a CTA.
- **Services:** **no prices anywhere.** Four capabilities; the **interactive system map** (`src/system-map.ts`, loaded only on Services) with four sector scenarios and a **System map / User map** toggle. Journey steps link to the system parts behind them and back again. Deep link: `services.html?map=ministry|trade|agency|studio#map` (add `&view=user` for the user map). Then three partnership models on a "you run it → we run it" spectrum (Atlas still marked Coming soon), a FAQ and a CTA.
- **Portfolio:** infinity-loop hero, four anonymous sector case cards (challenge → what we built → why it matters), each linking into its system map, plus an "engagement ends" truth band and a stack strip. Still fully anonymous, with no client names.
- **Follow-up (same day):** About hero now uses the real `fls-mark.webp` with a neon outline traced from the image's own alpha edge (`#nxRibbon` path) and neon rings drawn over the measured orb centers, so the neon matches the logo exactly. Services gained three sections after the capabilities: **"A proposal built only for you"** (private, password-protected proposal page with a neon mockup — no client names or prices), **"Every phase is built to scale"** (Discovery: technical + user, then Foundation → Connect → Expand on a rising curve, each with a "Scale lens"), and **"A complete solution in as few products as possible"** (friction mapping, MCP connections, Zero UI / faceless interfaces, fewest products). The hero line and the pricing FAQ now point to the proposal page.
- **Follow-up 2:** headline highlights switched from a rainbow gradient to brand gold; the off-brand mint accent replaced everywhere (pages, map, orbs) by logo navy `--nx-navy`. **Contact** and **Start** rebuilt in the neon system: sticky intro aside (Start shows the 4-step path: brief → talk → private proposal → discovery) beside a neon form card. Form IDs, `name`s and radio `value`s are unchanged, so Google Sheet columns are unaffected; the "$100/hr" tier hint is gone. Budget range and timeline questions were later removed from Start entirely (the sheet's `budget` / `timeline` columns will simply stay empty for new briefs). Success message copy in `main.ts` now says "Message received" / 1–2 business days. The Start "How involved" question is now **multi-select checkboxes for Tier 1–3 only** (combo and "Not sure yet" options removed); `main.ts` joins repeated form keys with ", " before posting so the Apps Script still gets every selection in one `services` value.
- **Home polish:** home now loads `src/neon.ts` and the shared defs (`<body class="home">`; overrides live in the "Home polish" block at the end of `styles.css`). Pill nav CTA; "Real results." in brand gold; pill buttons. The scroll-driven hero is unchanged except the merged mark now gets the traced neon outline + orb rings, which draw in as `--p` goes 0.42 → 1, plus a scroll hint that fades out. Three forces became neon cards; new "What we do" teaser (4 link cards + link to the system map); stats restyled as a neon band and reworded to "6+ client engagements · 4 sectors served · 3 ways to partner · 100% yours to own"; closing CTA + shared footer. On phones the merged mark shows below the hero copy, and the nav drops the wordmark, Home link and (≤480px) the CTA.
- The rail logo on these pages is now a link to `index.html`, because `goHome()` only works on the homepage. The old `.belief*`, `.howwork`, `.sector*`, `.tier-*` styles are unused by these pages but kept for now.

### 2026-10-30 — Sentence case labels, no button arrows
- Removed `text-transform: uppercase` from 41 rules (eyebrows, section/form/field labels, stat labels, tier badges, nav, rail, buttons); reset their wide caps letter-spacing to 0.01em and stepped sizes up (≈0.55–0.75rem → 0.72–0.88rem) so lowercase reads at the same weight. Rewrote the affected text to sentence case across all pages and dropped the trailing "→" from every button. Tier badges unified to "Tier N: Name".
- Follow-up: sentence-cased the remaining Title Case headings (About card titles, portfolio sector names, Services tier names, Start h1, Privacy title + section headings), the Services price labels ("Flat rate", "Estimated per project", "Flat rate + dedicated support") and team roles, and the footer "Privacy policy" link on every page. Proper nouns and acronyms keep their capitals (Google Sheets, AI/ML, TBD).

### 2026-10-30 — Rail logo fixed on every page
- Swapped the left-rail logo on `about`, `services`, `contact`, `start` and `portfolio` from the inline base64 JPEG (opaque black square) to the shared transparent `fls-mark.webp`. No more inline logo data anywhere; each page dropped ~45 KB and the logo is now one cached asset.

### 2026-10-30 — Text legibility pass
- Replaced the alpha-white secondary text tokens with solid lavender-greys (`--text-muted` `#ABA4BD`, `--text-subtle` `#8F88A3`), raised body weight 300 → 400, and made `.cs-tags .pc-tag` 0.76rem sentence case in body grey. Tokenized the leftover hard-coded alpha greys in the (unused) `.cs-*` ledger styles.

### 2026-10-30 — Portfolio stripped to icons + tags
- **Portfolio (`portfolio.html`):** each sector card is now just an accent-colored line icon (`.sector-ic`: cross, map pin, layers, spark), the sector name and a few tags. Removed the intro sentence, the per-card one-liners and bullet lists, the "Technologies We Work With" band (`.tech-grid`), and the CTA label/paragraph (title + button remain). Page fits on one screen.

### 2026-10-30 — Portfolio reframed by sector; About rebuilt
- **Portfolio (`portfolio.html`):** replaced the per-client Option 1B ledger with **four anonymous, work-focused sector cards** — Ministry & Nonprofits, Trade & Local Business, Agencies, Studios & Ventures. Each card leads with the kind of work delivered in that sector (no client names, no "Visit website" links — fully anonymous by request), with discipline/stack tags (`.cs-tags .pc-tag`). Dropped the discipline filter tabs and the inline filter script. Kept the "Technologies We Work With" band and the CTA. New styles: `.sector-grid` / `.sector*` (2-col, 1-col on mobile). The old `.cs-*` ledger styles remain in `styles.css` but are now unused.
- **About (`about.html`):** removed two broken/heavy interactive components — the `principles-slider` (one giant card + cramped vertical strips) and the `phases-track` click-to-expand accordion. Replaced with an always-visible **"What we believe"** principle grid and **"How we work"** step grid (styled like the homepage three-forces cards: color-accented, eyebrow + title + one line each). Trimmed the intro from three paragraphs to two. New styles: `.belief-grid` / `.belief*`, `.howwork` / `.step*`. `activatePrinciple` / `togglePhase` in `main.ts` are now unused.

### 2026-08-10 — Home hero: scroll-driven brand mark + three-forces section
- **Fixed the broken logo:** the hero and nav marks were a JPEG mislabeled as PNG (`data:image/png;base64,/9j/…`) on an opaque black square. The real logo (on black) was recovered from the base64 still embedded in the other pages, cropped to content and converted to a **transparent `fls-mark.webp`** (48 KB, alpha from the value channel). Hero and homepage nav now render the real mark — pixel-perfect curve and gradient.
- **Scroll-driven hero (`index.html` / `styles.css` + inline JS):** a sticky "scroll track" (`.hero-scrolly` → sticky `.home-hero`) whose JS sets a single progress var `--p` (0→1) on scroll. At `p=0` the three brand balls sit on **concentric orbits** (SVG overlay, color-matched to the logo: violet `#5b3ad9`, gold `#e8c34a`, cyan `#23aeca`). As you scroll they fly to their resting spots and **cross-fade into the real `fls-mark.webp`** (fades in ~p 0.34→1); orbits fade, caption lands. Everything defaults to the merged state, so no-JS / `prefers-reduced-motion` shows the finished mark with the track collapsed (no dead scroll).
- **Three-forces section** (below the hero): each brand ball is a force we bring — **Context** (gold, "We learn your world first"), **Clarity** (violet, "We make the path visible"), **Energy** (cyan, "We bring the momentum"). Colors keyed to the mark.
- `fls-mark.webp` is the canonical logo asset (the original raster lives only in git history).

### 2026-08-10 — Portfolio redesign (Option 1B) + hero stat
- **Portfolio (`portfolio.html`):** replaced the flip-card grid with a **case-study "ledger"** (redesign Option 1B). Seven engagements grouped into four disciplines (AI Strategy & Enablement, Automation & Systems, Growth & Visibility, Product & Thought); each is an expandable `<details>` row with brief → approach → result. Discipline filter tabs (inline script) show/hide groups. Preserved the client website links added during the Vite migration (Grace Church, Kingdom Forge Games, Detour, Digital Expositor) as accent-tinted "Visit website →" links inside each row. Kept the "Technologies We Work With" band below the ledger.
- **Home (`index.html`):** hero stat updated from `3+ Client Domains Served` → `6+ Client Engagements` (the `+` signals more clients in the pipeline).
- **Styles (`styles.css`):** appended the `.cs-*` ledger styles and `.cs-visit` link style; scoped the ledger's tag rule to `.cs-tags .pc-tag` so it doesn't override the existing card `.pc-tag`.
- Source of the redesign: "Freelancer Studios Portfolio Redesign" package from Claude Design (Option 1B).
