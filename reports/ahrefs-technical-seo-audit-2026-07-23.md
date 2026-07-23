# TaoTrails Ahrefs Technical SEO Audit

- Audit date: 2026-07-23
- Production site: `https://taotrails.com/`
- Repository: `/Users/jazfox/Documents/TaoTrails`
- Ahrefs source: latest email crawl at `2026-07-19 14:23 UTC`
- Email figures: 17 internal URLs, Health Score 100, 0 errors, 6 warnings, 16 notices, 3 3XX redirects, 3 short meta descriptions, 14 missing X cards, 14 missing Open Graph tags, 2 HTTP→HTTPS redirects, and 1 page with one dofollow incoming internal link
- Duplicate email handling: an earlier email with the same subject and identical counts existed on the same day. Counts were not added together.

## Executive result

The current source, a fresh final build, production HTML, sitemap, host variants, redirect rules, and the final-build link graph were audited independently of the old Ahrefs counts.

| Finding | Current reproduction | Local result |
| --- | ---: | --- |
| Indexable canonical HTML pages | 14 | Retained at 14 |
| Missing Open Graph pages | 14 | Fixed on all 14 |
| Missing X/Twitter Card pages | 14 | Fixed on all 14 |
| Short descriptions matching the Ahrefs pattern | 3 | Fixed on Contact, Privacy, Terms |
| 3XX categories represented in the Ahrefs total | 3 | Reasonably retained: HTTP apex, HTTP www, HTTPS www |
| HTTP→HTTPS variants | 2 | Healthy one-hop redirects retained |
| One-inbound-link pages | 1 | `/tao-te-ching/chapter-1/`; intentionally retained |
| Production soft 404 | 1 behavior affecting arbitrary unknown URLs | Locally fixed with a custom `404.html`; production verification remains required after a separately authorized release |

The 17-URL Ahrefs total reconciles cleanly as 14 canonical HTML pages plus the three host/protocol redirect entry points exposed by `_redirects`. Ahrefs' exact historical URL export was not available, so this is an evidence-based reconciliation rather than a claim about the crawler's private URL list. The current repository and production behavior support it, and no redirect URL was added to the sitemap.

## Repository and ff-only synchronization

Pre-sync state matched the authorized baseline:

- Branch: `main`
- Local HEAD: `16233455abe5309b8e494ec2f59aeb7399eeaf40`
- `origin/main`: `afa97a1d339e19b20cfcecbf8c39f25e1a8374fa`
- Ahead/behind: `0/1`
- No tracked modifications
- Only pre-existing untracked file: `reports/gsc-weekly/2026-07-20-taotrails.com-gsc-weekly-review.md`
- Remote: `https://github.com/jazfox-cloud/TaoTrails.git`

`git pull --ff-only origin main` completed as a fast-forward with no merge commit, rebase, stash, reset, clean, or file removal.

Post-sync state:

- HEAD and `origin/main`: `afa97a1d339e19b20cfcecbf8c39f25e1a8374fa`
- Ahead/behind: `0/0`
- Synced commit: `afa97a1d339e19b20cfcecbf8c39f25e1a8374fa Avoid Cloudflare email link rewriting`

The remote commit modified only Contact, Privacy, Terms, `scripts/check-site.mjs`, and the new `js/email-link.js`. It did not change the production domain or remove site content.

## EmailLink protection regression

The synchronized EmailLink implementation was retained without replacement or rollback.

| Page | No-JS source fallback | JavaScript-visible text | Final href | Cloudflare `/cdn-cgi/l/email-protection` dependency |
| --- | --- | --- | --- | --- |
| `/contact/` | `TaoTrails by email` with `data-email-user="hello"` and `data-email-domain="taotrails.com"` | `hello@taotrails.com` | `mailto:hello@taotrails.com` | None |
| `/privacy/` | Same | `hello@taotrails.com` | `mailto:hello@taotrails.com` | None |
| `/terms/` | Same | `hello@taotrails.com` | `mailto:hello@taotrails.com` | None |

All three final-build pages load `/js/email-link.js`. The existing site check still rejects raw `mailto:` or `hello@taotrails.com` in source HTML. The no-JavaScript fallback remains understandable, although intentionally not a clickable raw email address.

## Complete canonical page inventory

All listed responses were HTTP 200 in the current production baseline. All are indexable, in the sitemap, have no robots meta and no `X-Robots-Tag`, and use a self-referencing HTTPS apex canonical. Final local metadata contains one H1, nine required Open Graph fields, and five required Twitter fields per page.

| URL | Type | Title length | Description before→after | H1 | Images / alt | Dofollow inbound sources | Main topic and sensitive-content boundary |
| --- | --- | ---: | ---: | ---: | --- | ---: | --- |
| `https://taotrails.com/` | Home/hub (`website`) | 63 | 125→125 | 1 | 1 / informative | 13 | Taoist culture and sacred-travel overview |
| `/taoism/` | Cultural guide (`article`) | 49 | 132→132 | 1 | 0 | 13 | Religious/cultural education; explicit non-medical boundary |
| `/taoism/origins/` | History guide (`article`) | 33 | 149→149 | 1 | 0 | 4 | Origins, Laozi traditions, ritual history; disputed claims are framed cautiously |
| `/tao-te-ching/` | Text hub (`website`) | 30 | 131→131 | 1 | 1 / informative | 5 | Translation/copyright boundary and original-paraphrase policy |
| `/tao-te-ching/chapter-1/` | Chapter commentary (`article`) | 44 | 121→121 | 1 | 1 / informative | 1 | Original TaoTrails paraphrase, not a copied modern translation |
| `/sacred-mountains/` | Travel hub (`website`) | 44 | 125→125 | 1 | 4 / informative | 13 | Sacred-mountain travel and religious heritage |
| `/sacred-mountains/wudang-mountain/` | Destination guide (`article`) | 40 | 134→134 | 1 | 1 / informative | 2 | Wudang temples, martial heritage, travel intent |
| `/sacred-mountains/zhongnan-mountain/` | Destination guide (`article`) | 55 | 127→127 | 1 | 1 / informative | 4 | Hermit culture and Laozi memory; avoids spectacle claims |
| `/lifestyle/temple-etiquette/` | Practical guide/tool (`article`) | 53 | 116→116 | 1 | 0 | 7 | Respectful religious-site behavior |
| `/lifestyle/taoist-tea/` | Cultural guide/tool (`article`) | 61 | 139→139 | 1 | 1 / informative | 4 | Tea culture and timer; explicitly makes no health claims |
| `/about/` | Information page (`website`) | 39 | 124→124 | 1 | 0 | 13 | Editorial standards and source separation |
| `/contact/` | Functional page (`website`) | 17 | 88→151 | 1 | 0 | 13 | Corrections, sources, privacy and accessibility contact |
| `/privacy/` | Legal page (`website`) | 26 | 29→140 | 1 | 0 | 13 | Hosting, analytics, security, advertising cookies and privacy requests |
| `/terms/` | Legal page (`website`) | 24 | 61→154 | 1 | 0 | 13 | Accuracy limits, attribution, acceptable use and contact |

Canonical URLs in the table are abbreviated after the first row; every actual tag uses the full `https://taotrails.com/...` URL.

## Non-canonical and special URL inventory

| URL/category | Current behavior | Classification | Sitemap |
| --- | --- | --- | --- |
| `http://taotrails.com/...` | 301 to HTTPS apex, path/query preserved | Normal protocol redirect | Excluded |
| `http://www.taotrails.com/...` | 301 directly to HTTPS apex, path/query preserved | Normal protocol+host redirect | Excluded |
| `https://www.taotrails.com/...` | 301 to HTTPS apex, path/query preserved | Normal host redirect | Excluded |
| HTTPS paths without trailing slash | 308 to the slash URL | Normal Pages path normalization | Excluded |
| `/index.html`, nested `index.html` | 308 to clean canonical path | Compatibility normalization | Excluded |
| Canonical URL with query | 200; canonical omits query | Query variant | Excluded as a separate URL |
| `/404` | Current production: 200 homepage soft 404. Local final preview: 308 to `/404/` | Special missing path | Excluded |
| `/404/` | Current production: 200 homepage soft 404. Local final preview: 404 custom page | Custom 404 target | Excluded |
| `/404.html` | Current production: 200 homepage soft 404. Local final preview: direct 200 noindex custom file | Direct static 404 document | Excluded |
| Arbitrary unknown path | Current production: 200 byte-identical homepage. Local final preview: 404 custom page | Production soft 404 fixed locally | Excluded |
| Static CSS, JS, JPEG, SVG, PNG | Asset responses | Static resources | Excluded |

The local custom 404 has `noindex, follow`, one H1, no canonical, no `og:url`, and no social image metadata. It does not auto-redirect to the homepage.

## Open Graph and Twitter remediation

Before remediation, production and source had zero Open Graph and Twitter fields on all 14 canonical pages.

Every final page now has exactly:

- Open Graph: `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`
- Twitter: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`

`og:url` equals the canonical. All URL values are absolute HTTPS apex URLs. Content guides use `article`; hubs, information, contact and legal pages use `website`. `twitter:card` is `summary_large_image`. No fictional `twitter:site` or `twitter:creator` was added.

## Social sharing image

The repository's existing hero, mountain, book and tea raster assets have source-size files or optimized derivatives, but no discoverable license/provenance record. They were not repurposed for global social sharing.

The new image is an original code-native design created for this task:

- SVG: `public/assets/taotrails-social.svg`
- PNG: `public/assets/taotrails-social.png`
- Visual language: existing TaoTrails pine, moss, paper, clay and gold palette; abstract mountains, rising sun and trail
- Third-party photos, artwork, logos, religious symbols and embedded raster images: none
- Text: `TaoTrails` and the site's real culture/sacred-mountain positioning
- SVG size: 1,466 bytes
- PNG size: 44,454 bytes
- PNG: genuine non-interlaced, opaque RGB, exactly 1200×630
- SVG SHA-256: `544ba6237c1471812e009c2f80cdfc77858b725d765c48b6ab96ba8632edb20d`
- PNG SHA-256: `8425b1d2464acab6137d904c856a9037dde796a4d36930bbff094801ece71e81`
- Local HTTP: 200 with `image/png`
- Full-size and 400×210 checks: no clipping, overlap, transparency, blur or abnormal crop

## Description changes

Only the three indexable pages matching the current short-description reproduction were changed.

| URL | Type | Before | Length | After | Length | Body basis |
| --- | --- | --- | ---: | --- | ---: | --- |
| `/contact/` | Functional | Contact TaoTrails about cultural corrections, travel updates, privacy, or accessibility. | 88 | Contact TaoTrails to report cultural or historical corrections, changing travel details, source suggestions, privacy concerns, or accessibility issues. | 151 | Existing correction, travel-detail, source, privacy and accessibility contact purposes |
| `/privacy/` | Legal | Privacy policy for TaoTrails. | 29 | Read how TaoTrails handles basic hosting, analytics, security, advertising cookies, privacy choices, and requests from visitors to the site. | 140 | Existing hosting, analytics, security, advertising-cookie, opt-out and contact sections |
| `/terms/` | Legal | Terms governing use of TaoTrails cultural and travel content. | 61 | Read the terms for using TaoTrails cultural education and travel inspiration, including accuracy limits, attribution, acceptable use, and contact details. | 154 | Existing educational-content, changing-accuracy, attribution, acceptable-use and contact sections |

The 116-character Temple Etiquette description was not changed because it did not reproduce the three-item Ahrefs pattern and accurately summarizes the page.

## Redirect and HTTP→HTTPS matrix

| Start URL | Hop 1 | Final | Redirects | Path/query |
| --- | --- | --- | ---: | --- |
| `http://taotrails.com/` | 301 → `https://taotrails.com/` | 200 | 1 | Preserved |
| `https://taotrails.com/` | 200 | Same | 0 | N/A |
| `http://www.taotrails.com/` | 301 → `https://taotrails.com/` | 200 | 1 | Preserved |
| `https://www.taotrails.com/` | 301 → `https://taotrails.com/` | 200 | 1 | Preserved |
| `http://taotrails.com/taoism/` | 301 → HTTPS apex same path | 200 | 1 | Preserved |
| `https://www.taotrails.com/taoism/` | 301 → HTTPS apex same path | 200 | 1 | Preserved |
| `https://www.taotrails.com/taoism/?ref=audit` | 301 → apex with `?ref=audit` | 200 | 1 | Preserved |
| `https://taotrails.com/taoism` | 308 → `/taoism/` | 200 | 1 | Preserved |
| `https://taotrails.com/index.html` | 308 → `/` | 200 | 1 | Cleaned |
| `https://taotrails.com/taoism/index.html` | 308 → `/taoism/` | 200 | 1 | Cleaned |

All observed production responses report `server: cloudflare`. The repository contains equivalent host/protocol rules in `_redirects` and `functions/_middleware.js`; response headers alone cannot prove which Pages/edge layer served a specific redirect. There are no loops or two-hop www+HTTP chains. No Cloudflare Single Redirect is needed.

The two HTTP→HTTPS notices are expected for HTTP apex and HTTP www. They are not errors and were not removed.

## Weak internal link

- URL: `https://taotrails.com/tao-te-ching/chapter-1/`
- Type: indexable chapter commentary
- Sitemap: included
- Canonical: self-referencing
- Current dofollow incoming source: `/tao-te-ching/`
- Anchor: the Chapter 1 card, “Chapter 1: The nameless beginning …”
- Approximate click depth from home: 2
- Orphan: no
- Hierarchy: clear text-hub → chapter relationship
- Content boundary: explicitly original paraphrase/commentary, not a copied modern translation
- Source caveat: the page states its paraphrase policy but has no external scholarly citation list

No link was added. A single relevant parent entry is preferable to a footer link or an unrelated contextual link. The site's existing links from Chapter 1 back to Taoism, origins and Zhongnan do not create incoming sources and were not rewritten.

## Sitemap, canonical, robots, titles, H1, links and assets

- Sitemap: 14 entries, 14 unique, all canonical HTTPS apex URLs
- Sitemap redirects, HTTP, www, query, 404 or noindex URLs: 0
- Robots: allows crawling and declares `https://taotrails.com/sitemap.xml`
- Sitemap/noindex conflicts: 0
- Canonicals: 14/14 self-referencing and equal to final clean URLs
- Titles: 14/14 present and unique; range 17–63 characters
- Descriptions: 14/14 present and unique; final range 116–154 characters
- H1: exactly one on every canonical page and on the custom 404
- Broken internal links: 0
- Redirecting internal links: 0
- Canonical-page orphans: 0
- Weak one-source pages: 1, documented above
- HTML images: 10
- Informative alt: 10
- Empty alt: 0
- Missing alt: 0
- Broken image references: 0
- JSON-LD blocks: 0; therefore no JSON-LD parse failures
- Meta refresh: 0
- JavaScript page redirects: 0

## Citation, translation and content-truth boundary

- The Tao Te Ching hub says it uses short original paraphrases/commentary and warns against copying modern translations without clear rights.
- Chapter 1 labels its text as an original TaoTrails paraphrase, not a copied modern translation.
- No long classical quotation or modern translation was added.
- No existing quotation, paraphrase, attribution, historical claim, body copy or religious-practice statement was changed.
- No medical, therapeutic, psychological, spiritual-result, scientific-evidence or authority claim was added.
- The Origins page has a responsible source plan but not a completed citation list. That is a content-research follow-up, not a technical metadata edit.
- Existing raster-image license/provenance documentation remains incomplete. This audit avoided using those assets for the social card.

## 404 and soft-404 result

Current production returned the homepage with HTTP 200 and the homepage canonical for `/404`, `/404/`, `/404.html`, and an arbitrary nonexistent path. The bodies were byte-identical to the homepage, confirming a genuine soft-404 behavior.

Local remediation:

- Added `404.html`
- Added it to the final build
- `noindex, follow`
- No canonical, `og:url`, `og:image`, or `twitter:image`
- One H1 and a visible home link
- Final preview serves arbitrary missing paths with HTTP 404
- `/404` → 308 `/404/` → 404
- `/404/` → 404
- `/404.html` → 200 direct static document with `noindex`
- No redirect to home

Production cannot be claimed fixed until an authorized deployment and live verification occur.

## Regression tooling

Added `scripts/check-seo.mjs`, using Node standard-library APIs only. It verifies:

- 14 unique sitemap URLs
- matching local pages and self canonicals
- title/description presence and uniqueness
- description bounds
- sitemap/noindex conflicts
- one H1
- all required OG/Twitter fields and value consistency
- social PNG signature, dimensions and opaque RGB color type
- SVG envelope and dimensions
- internal links, redirecting slashless links, orphan/weak pages
- image existence and alt classification
- JSON-LD parsing when present
- robots sitemap declaration
- 404 noindex and canonical/social exclusions
- meta refresh and JavaScript redirects

Added `scripts/preview.mjs` to serve the final `dist` build with clean-path normalization and the custom 404, without adding a browser framework or heavy dependency.

`npm run check` now checks source requirements, builds `dist`, and audits the final build.

## Build and quality results

| Command | Result |
| --- | --- |
| `npm run check` | Pass: 36 required files; final SEO check passes 14 indexable pages |
| `npm run build` (first final run) | Pass |
| `npm run build` (second final run) | Pass |
| Final tree hash, run 1 | `43e3cb16955221c4a6363f6dfaaa539188f63f0a5dd40535a82b0674d173eefc` |
| Final tree hash, run 2 | `43e3cb16955221c4a6363f6dfaaa539188f63f0a5dd40535a82b0674d173eefc` |
| `node scripts/check-seo.mjs --root=dist` | Pass |
| `git diff --check` | Pass |

No lint, typecheck or test scripts exist in `package.json`, so none were reported as run.

`dist/` is generated by `scripts/build.mjs` and ignored by `.gitignore`; it is not Git-managed and must be generated for a dist-based release, not committed under the current repository policy.

## Desktop and mobile visual verification

Exact viewports:

- Desktop: 1440×900
- Mobile: 390×844

Pages checked in the final build:

- Home
- `/taoism/` core content
- `/privacy/` changed-description page
- `/tao-te-ching/chapter-1/` weak-link target
- `/about/`
- arbitrary-path custom 404
- social PNG

Results:

- Header, footer and navigation render normally
- One visible H1 per HTML page
- Metadata does not appear in body content
- Chapter paraphrase and body typography remain readable
- No full-page horizontal overflow
- No overlap or abnormal cropping
- Loaded page images have non-zero natural dimensions
- 404 stays on the missing URL and does not redirect home
- Social image is readable at full size and thumbnail size
- Browser console errors/warnings: 0
- Final-build Contact, Privacy and Terms EmailLink checks pass

## Files changed

Modified:

- `index.html`
- `about/index.html`
- `contact/index.html`
- `privacy/index.html`
- `terms/index.html`
- `taoism/index.html`
- `taoism/origins/index.html`
- `tao-te-ching/index.html`
- `tao-te-ching/chapter-1/index.html`
- `sacred-mountains/index.html`
- `sacred-mountains/wudang-mountain/index.html`
- `sacred-mountains/zhongnan-mountain/index.html`
- `lifestyle/temple-etiquette/index.html`
- `lifestyle/taoist-tea/index.html`
- `package.json`
- `scripts/build.mjs`
- `scripts/check-site.mjs`

Added:

- `404.html`
- `public/assets/taotrails-social.svg`
- `public/assets/taotrails-social.png`
- `scripts/check-seo.mjs`
- `scripts/preview.mjs`
- `reports/ahrefs-technical-seo-audit-2026-07-23.md`

## Disposition

### Reproduced and fixed locally

- 14/14 missing Open Graph pages
- 14/14 missing Twitter Card pages
- Three short descriptions
- Production soft-404 behavior, via a local custom 404 and final-build preview behavior
- Missing technical SEO regression coverage

### Reproduced and reasonably retained

- Three host/protocol redirect categories
- Two HTTP→HTTPS redirects
- One weak incoming-link page with a legitimate hub→chapter hierarchy
- Normal trailing-slash and `index.html` normalization

### Could not reproduce

- Broken internal links
- Redirecting links inside canonical-page HTML
- Sitemap redirects/noindex/404 conflicts
- Missing H1, canonical, title or image alt
- Redirect loops or host/protocol redirect chains
- Invalid JSON-LD

### Needs human evidence or a separate task

- Rights/provenance documentation for the pre-existing raster photos and illustrations
- Scholarly citations for historical/religious content expansion
- Whether Chapter 1 should later receive another genuinely relevant editorial link after more chapter content exists

### Optional enhancement

- A reusable build-time page template could reduce repeated metadata markup if the static MVP adopts a generator. The current hand-authored structure was preserved to avoid changing deployment architecture during a focused audit.

### Requires later production verification

- Deploy the local 404 and metadata changes only under separate authorization.
- After deployment, verify arbitrary missing paths return HTTP 404 and the social PNG returns 200 `image/png`.
- No Cloudflare Single Redirect change is recommended; current host/protocol redirects already complete in one hop.

## Protected file and final Git state

`reports/gsc-weekly/2026-07-20-taotrails.com-gsc-weekly-review.md` was not read into the Ahrefs report as audit evidence, modified, moved, deleted, staged or committed. It remains a separate pre-existing untracked report.

No `git add`, commit, push, deploy, Cloudflare write, GSC write, Ahrefs validation, or indexing request was performed.
