# Portfolio improvement ideas

Working checklist of theme-consistent upgrades for the "Mindows 2005" portfolio, grouped
by area. Nothing here is scheduled — check items off as they get done.

## Performance & images

- [ ] Compress/convert the photo gallery in `public/assets/icons/M-photos/` (several
      multi-MB JPEGs/PNGs — `capstone-showcase-collegiate.jpeg` 5.1MB,
      `Volunteer-Az-humane-society.jpeg` 3.3MB, `Camp-counselor.jpeg` 2.8MB, `evexia.png`
      2.0MB, `IMG_0807.jpeg` 2.0MB) to WebP/AVIF with sane max dimensions + `srcset`.
      Target: `public/` from ~27MB down to well under 5MB with no visible quality loss.
- [ ] Add `loading="lazy"` to the rest of the AboutPage gallery and any other image-heavy
      pages (PawPal article) — currently only one image in `AboutPage.tsx` has it.
- [ ] Stop render-blocking the Google Fonts `@import` in `src/index.css` — switch to
      `<link rel="preconnect">` + `<link rel="stylesheet">` in `index.html`, or self-host
      JetBrains Mono + Inter as `woff2`.
- [ ] Code-split rarely-opened windows with `React.lazy()` — `SnakeGame`, `Terminal`, and
      each page in `registry.ts` are all in the main bundle today even if never opened.
- [ ] Downscale uploaded wallpapers (canvas resize) before storing as base64 in
      `localStorage` (`Index.tsx`) — currently unbounded, can hit quota/bloat reloads.
- [ ] Optional: audit unused shadcn/Radix components under `src/components/ui/` if bundle
      size ever becomes a concern (Vite tree-shakes them today, so low priority).

## Accessibility & keyboard navigation

- [ ] Make desktop icons keyboard-operable — `DesktopIcons.tsx` uses `<div onClick>` with
      no `role="button"`/`tabIndex`/Enter-Space handling today.
- [ ] Add visible focus rings (themed, e.g. dashed XP-blue outline) and move focus into a
      window (title bar or first control) when `BrowserWindow`/Terminal opens.
- [ ] Add a `prefers-reduced-motion` block to `ProjectsPage.css` (Snake/About/Contact
      already have one; Projects doesn't despite its own transitions).
- [ ] Reconsider `autoFocus` on the Terminal input — only focus it when opened by explicit
      user action, not on initial page load.
- [ ] Add `<main>`/`<nav>` landmark roles to the top-level shell in `Index.tsx` (currently
      mostly plain `<div>`s) without changing the visual chrome.

## SEO & shareability

- [ ] Fix the OG/Twitter meta in `index.html` — `og:url`/`og:image`/Twitter card are
      hardcoded to the GitHub Pages domain, but the site also deploys to AWS at a
      different base path. Decide on a canonical domain or generate per-target.
- [ ] Add `sitemap.xml` + a `Sitemap:` line in `robots.txt`, listing the real routes that
      now exist: `/`, `/about`, `/projects`, `/projects/:slug` per project, `/experience`,
      `/contact` (shipped in "Give portfolio pages real, SEO-friendly URLs").
- [ ] Set per-route `<title>`/meta description (e.g. a small effect that updates
      `document.title` per page) so each URL's tab title/social preview matches that
      specific page instead of the generic "Mindows 2005" title everywhere.
- [ ] Double check `<link rel="icon" href="/fav.png">` survives the `/manus/` base-path
      GitHub Pages build.

## New content/features within the theme

- [ ] Wire up the Contact form backend (`ContactPage.tsx` has the TODO + UI already built,
      currently just shows a "not connected yet" message). AWS Lambda + API Gateway would
      fit next to the existing S3/CloudFront deploy target; keep the `mailto:` fallback.
- [ ] Extract PawPal's inline content (`featureRows`/`productCards`/`commonQuestions`) into
      a `pawpalPageData.ts`, matching the Projects/About/Experience data/presentation split.
      Then generalize `ProjectsPage.tsx`'s hardcoded `slug === 'pawpal-ai'` check into a
      generic `detailPage` field so any project can opt into its own article.
- [ ] More Terminal easter eggs — a `sudo` joke, `ipconfig`/`ping manushri.dev` gag, a
      `matrix` command that flips the terminal theme, a hidden Konami-style boot egg.
- [ ] A second desktop game (minesweeper.exe / solitaire.exe) following Snake's existing
      `chromeMode="utility"` window pattern.
- [ ] A themed 404/offline state — a BSOD-styled `NotFound` page fits the OS parody well.
- [ ] Lightweight, privacy-respecting analytics (Plausible/Fathom, no cookie banner) to see
      which parody pages/projects actually get explored.
