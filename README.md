# ideep.ir — landing (Persian)

Static Astro site, right-to-left. A copy of the English landing (`ideepapp-landing`) with the copy in Persian and Bale and Eitaa added next to Instagram and Telegram. No backend calls; every CTA links to the dashboard.

- `npm run dev` (port 4322 in `.claude/launch.json`) / `npm run build`
- Copy lives in `src/data/fa.ts`. Prices live in `src/data/pricing.ts` (same as the English site, USD).
- The hero animation (`src/components/HeroMotion.astro`) draws itself mirrored when the page is RTL.
- Dashboard URL: set `PUBLIC_APP_URL` (default `https://dashboard.ideep.ir`); site URL: `SITE_URL` (default `https://ideep.ir`). See `.env.example`.
- Deploy: one Dokploy Application from this repo (Dockerfile, nginx on port 80). No environment variables are required.
