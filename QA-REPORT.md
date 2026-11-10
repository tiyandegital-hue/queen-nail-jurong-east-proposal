# QA REPORT — Queen Nail demo site (LACQUER POP)

**Build dir:** `~/workspace/lead-builds/sg-queen-nail-jurong-east/`
**Date:** 2026-11-10 (Tue 10 Nov 2026, Asia/Dhaka)
**Design system:** LACQUER POP per STITCH-EXPORT.md — deep aubergine plum #180914 / #240e1f, hot coral-red #FF385C / #FF4D4D, electric lacquer pink #FF2A85; Syne headlines + Plus Jakarta Sans body; swatch-chip motif; marquee strip. No ivory/espresso house template used anywhere.
**Status: PASS** — all gates below green, with the limitations in (f).

## (a) Pages + link audit — PASS
- **9/9 pages exist** at build-dir root: `index.html`, `services.html`, `gallery.html`, `booking.html` (star page), `lashes.html`, `nail-art.html`, `inspiration.html`, `visit.html`, `faq.html`.
- Automated audit (Python, run 2026-11-10): every internal `href`/`src` on all 9 pages resolves to an existing file; CSS `url()` font refs resolve; **0 dead internal links, 0 missing assets**.
- Every page links all 9 pages in its nav (checked programmatically — no missing nav links).
- HTML tag-balance check (html.parser) on all 9 pages: **OK, no unclosed/mismatched tags**.
- `vercel.json` present with `{"$schema": "https://openapi.vercel.sh/vercel.json", "cleanUrls": true}`.
- Image labelling: every `<img>` on the site sits inside a figure/hero block carrying a visible `[SAMPLE] AI-generated sample` badge (index 4 imgs, gallery 6, inspiration 7, nail-art 5, lashes 1; booking/services/visit/faq have no photos). Footer on every page repeats the AI-sample notice.

## (b) Viewport / overflow audit (static) — PASS with stated limit
- **No headless browser is available on this VM** (no Chromium render path in this environment), so no rendered screenshot or live layout measurement was possible. This audit is static, stated plainly.
- Verified by inspection: viewport meta `width=device-width, initial-scale=1` on all 9 pages; `box-sizing: border-box` globally; `img { max-width: 100% }`; `body { overflow-x: hidden }`; mobile-first single-column grids, 2-col at ≥720px, 3-col at ≥720px, booking 2-col at ≥960px; nav is a horizontally scrollable row on mobile (no page-level overflow); the lash comparison table is wrapped in an `overflow-x: auto` container; the only `width: 720px / 960px` matches in CSS are `@media (min-width: …)` breakpoints, not element widths.
- No fixed-width element wider than 390px was found. Expected result at 390px and 1280px: no horizontal overflow. A rendered check is still recommended on the parent's side before go-live.

## (c) JS + external scripts — PASS
- `node --check assets/js/main.js` → **OK**.
- No external scripts: the only `<script>` tags are the local `assets/js/main.js` on all 9 pages plus one small inline handler on `visit.html` (demo contact form, shows a "demo only — not sent" note). No CDN, no trackers, no external fonts.
- Business name is ONE swappable constant (`BUSINESS_NAME` in `assets/js/main.js`, applied to every `[data-business-name]` element).
- Booking dates: generated **live in JS from today** (`new Date()`, next 6 days). Verified by node simulation from 10 Nov 2026 → Tue 10 Nov – Sun 15 Nov 2026. No hard-coded Feb/Mar dates anywhere.
- Booking page: 3-step front-end mock (multi-select services, live date/time picker, contact form) + live summary card + confirmation state labelled "Demo request — not a confirmed booking", with a "Call the salon to confirm" CTA. Submitting sends nothing anywhere.

## (d) Fidelity scan — PASS (0 hits for every stripped item)
Grepped all 9 HTML files + `assets/css/main.css` + `assets/js/main.js` for every item in the STITCH-EXPORT.md fidelity audit list. **Total hits: 0** for:
`100% ARTISAN CARE`, `500+`, `300+`, `180+`, `Same-day`/`same-day`, `PayNow`, `NETS`, `Suwei` (capitalised staff name), `autoclave`, `Medical-Grade`/`medical-grade`, `Hospital-Grade`, `Japanese`, `Korean`, `6 to 8 weeks`, `Walk-in`/`walk-in`/`walk-ins`, `public holiday`/`Public Holiday`, `Jurong East Town Centre`, `MRT`, `Bus Interchange`, `Russian`, `48W`, `© 2025`/`2025`, `Feb 24`, `Mar 01`, `Zero Deposit`, `Pay in Salon`, `premier pampering`, `modern gel overlays`, `clinical sanitation`, `cold-pressed organic`, `diamond topcoat`, `Long-Wear Retention Lock`, `JURONG EAST STN`, `Ground Floor`, `Zero damage`, `complimentary spoolie`, `45–60`, `75–105`, `90–120`, `mins`, `minutes`, `WhatsApp`, `wa.me`.
- Note on `suwei`: 45 lowercase occurrences, **all** inside the verified email address `suwei.poh@gmail.com` (checked with context). No capitalised "Suwei" as a staff name anywhere.
- `&copy; 2026` present on all 9 pages (footer). No 2025 anywhere.
- FAQ answers 02–07 written only from verified facts; Q07 ("Do I need an appointment?") answers exactly: "Ask the salon — call +65 9349 1257 or email suwei.poh@gmail.com."
- Verified facts used only: Queen Nail; 348 Jurong East Ave 1, #01-1257, Singapore 600348; +65 9349 1257; suwei.poh@gmail.com; Mon–Sun 9am–9pm; 6 services; all prices "Price on enquiry". No other facts claimed. No service durations anywhere. No affiliation claim except the verified "no affiliation with Nail Queen, Far East Plaza" notice.

## (e) HTTP 200 serve test — PASS
`python3 -m http.server` + curl, all **200**: all 9 HTML pages, `assets/css/main.css`, `assets/js/main.js`, all 4 JPGs, both woff2 fonts, `vercel.json`. (Test server stopped afterwards.)

## (f) Limitations
1. **No rendered screenshot / live layout check** — no headless browser on this VM. Overflow verdict is static (see (b)); parent should eyeball at 390px and 1280px after deploy.
2. **Images are AI-generated samples, not real salon photos** (the salon has none online). 4 images generated with the media pipeline and reused with different crops/positions across pages; every one is visibly labelled `[SAMPLE] AI-generated sample` in-page. No image is presented as the salon's real work.
3. **Fonts**: Syne and Plus Jakarta Sans downloaded from Google Fonts as variable woff2 files and self-hosted under `assets/fonts/` (`syne-var.woff2`, `plus-jakarta-sans-var.woff2`) — the css2 API returns one variable file per family covering the requested weight range, so each family is a single file declared with a weight range. No CDN font loading.
4. **Booking + Visit Us forms are front-end demos** — no backend; nothing is sent. Both pages say so in-page.
5. **Not pushed to GitHub, not deployed** — parent handles that (per task).

## Commit-ready file list
```
index.html  services.html  gallery.html  booking.html  lashes.html
nail-art.html  inspiration.html  visit.html  faq.html  vercel.json
assets/css/main.css  assets/js/main.js
assets/fonts/syne-var.woff2  assets/fonts/plus-jakarta-sans-var.woff2
assets/img/hero-fuchsia-chrome.jpg  assets/img/gallery-coral-swirls.jpg
assets/img/gallery-cat-eye.jpg  assets/img/lashes-flutter.jpg
QA-REPORT.md
```
(Source docs already in dir: VERIFICATION.md, NICHE.md, PAGES.md, STITCH-PROMPT.md, STITCH-EXPORT.md.)
