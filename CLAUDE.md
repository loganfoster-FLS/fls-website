# Free Lancer Studios — Website

Live site: **freelancerstudios.solutions** (see `CNAME`). Static, deployed from this repo.

## Purpose (source of truth)

This website is a **marketing and lead-generation** asset. Every change should be evaluated against that goal:

- **Primary goal:** turn visitors into qualified leads. The conversion action is **"Start a Project"** (`start.html`) — the CTA that should be reachable from every page.
- **Secondary goal:** build credibility. The portfolio, service tiers, and about content exist to make a prospect trust FLS enough to start that conversation.
- **Audience:** organizations with real constraints — churches/ministries, agencies, trade businesses, game/venture studios — evaluating whether to hire FLS for AI strategy, automation, product/engineering, or search visibility work.
- **Tone:** confident, plain-spoken, outcome-focused. Content is kept "deliberately high-level out of respect for clients"; deeper detail is offered on request rather than published.

When in doubt, favor changes that improve clarity of the offer, credibility of the work, and the path to "Start a Project." Avoid vanity content that doesn't serve those.

## Tech stack

- **Build:** Vite 6 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`). Scripts: `npm run dev`, `npm run build`, `npm run preview`.
- **Entry/assets:** each page (`index.html`, `portfolio.html`, etc.) loads `/src/styles.css` and `/src/main.ts`.
  - `src/styles.css` defines Tailwind `@theme` tokens and then `@import "../styles.css"` — so the large hand-written **`styles.css` at the repo root is still the primary stylesheet** and flows into the build. Add page styles there unless they need Tailwind tokens.
  - `src/main.ts` holds the shared interactive behavior (rail nav, page toggles, forms). Page-specific one-off scripts may live inline in the page.
- **Pages:** `index` (home), `portfolio`, `services`, `about`, `contact`, `start`, `privacy`.
- **Deploy:** build output is `dist/` (gitignored). Do not commit `dist/` or `node_modules/`.

## Conventions

- Root `styles.css` is the source of truth for styling; `src/styles.css` only adds Tailwind theme tokens on top.
- Keep `/src/styles.css` + `/src/main.ts` as the asset references in page `<head>`s — do **not** revert pages to flat `styles.css` / `script.js` (that predates the Vite migration and breaks the build).
- Client-facing content is high-level by design; link out to live client sites where they exist rather than over-describing engagements.

## Change log

Newest first. Record notable content/structure changes here so the site's history stays legible.

### 2026-08-10 — Home hero: scroll-driven brand mark + three-forces section
- **Fixed the broken logo:** the hero and nav marks were a JPEG mislabeled as PNG (`data:image/png;base64,/9j/…`) on an opaque black square. The real logo (on black) was recovered from the base64 still embedded in the other pages, cropped to content and converted to a **transparent `fls-mark.webp`** (48 KB, alpha from the value channel). Hero and homepage nav now render the real mark — pixel-perfect curve and gradient.
- **Scroll-driven hero (`index.html` / `styles.css` + inline JS):** a sticky "scroll track" (`.hero-scrolly` → sticky `.home-hero`) whose JS sets a single progress var `--p` (0→1) on scroll. At `p=0` the three brand balls sit on **concentric orbits** (SVG overlay, color-matched to the logo: violet `#5b3ad9`, gold `#e8c34a`, cyan `#23aeca`). As you scroll they fly to their resting spots and **cross-fade into the real `fls-mark.webp`** (fades in ~p 0.34→1); orbits fade, caption lands. Everything defaults to the merged state, so no-JS / `prefers-reduced-motion` shows the finished mark with the track collapsed (no dead scroll).
- **Three-forces section** (below the hero): each brand ball is a force we bring — **Context** (gold, "We learn your world first"), **Clarity** (violet, "We make the path visible"), **Energy** (cyan, "We bring the momentum"). Colors keyed to the mark.
- **NOTE:** the other pages' nav headers still carry the old broken JPEG — swap them to `fls-mark.webp` for site-wide consistency. The real-logo source raster lives only in git history / this change; keep `fls-mark.webp` as the canonical asset.

### 2026-08-10 — Portfolio redesign (Option 1B) + hero stat
- **Portfolio (`portfolio.html`):** replaced the flip-card grid with a **case-study "ledger"** (redesign Option 1B). Seven engagements grouped into four disciplines (AI Strategy & Enablement, Automation & Systems, Growth & Visibility, Product & Thought); each is an expandable `<details>` row with brief → approach → result. Discipline filter tabs (inline script) show/hide groups. Preserved the client website links added during the Vite migration (Grace Church, Kingdom Forge Games, Detour, Digital Expositor) as accent-tinted "Visit website →" links inside each row. Kept the "Technologies We Work With" band below the ledger.
- **Home (`index.html`):** hero stat updated from `3+ Client Domains Served` → `6+ Client Engagements` (the `+` signals more clients in the pipeline).
- **Styles (`styles.css`):** appended the `.cs-*` ledger styles and `.cs-visit` link style; scoped the ledger's tag rule to `.cs-tags .pc-tag` so it doesn't override the existing card `.pc-tag`.
- Source of the redesign: "Freelancer Studios Portfolio Redesign" package from Claude Design (Option 1B).
