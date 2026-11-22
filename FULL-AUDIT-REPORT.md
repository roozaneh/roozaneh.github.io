# Full Audit Report

- URL: `https://roozaneh.github.io/`
- Generated: `2026-11-22T04:32:36.192884`
- Overall score: `75/100`
- Score confidence: `High`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 45 |
| Social Meta | 5 | 100 |
| Robots and Crawlers | 8 | 100 |
| Broken Links | 10 | 0 |
| Internal Links | 8 | 80 |
| Redirects | 3 | 100 |
| AI Search | 5 | 100 |
| Performance and Core Web Vitals | 13 | 85 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 100 |
| Entity SEO | 5 | 0 |
| Link Profile | 7 | 75 |
| Hreflang | 5 | 100 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | broken_links | 🔴 6 broken link(s) found |  |  |
| Critical | environment | 5 security headers missing | Missing headers reduce trust and can expose the site to browser/security risks. | Set security headers in `next.config.js` `headers()` or at your edge/CDN. |
| Critical | environment | 6 broken links detected | Broken internal links hurt crawl flow and user trust. | Fix links in route components and content source files; validate with link checks in CI. |
| Critical | security | 🔴 5 security headers missing — poor security posture |  |  |
| Warning | internal_links | ⚠️ 1 page(s) have fewer than 3 internal links |  |  |
| Warning | readability | ⚠️ Thin content (79 words) — may rank poorly |  |  |
| Warning | security | ⚠️ HSTS missing includeSubDomains directive |  |  |
| Info | Wikidata | No Wikidata entry found for 'روزنه (Roozaneh Network)'. |  | If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'روزنه (Roozaneh Network)'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| Info | entity | Could not verify sameAs URL: https://t.me/RoozanehHelp |  | Manually confirm this URL is accessible and correct. |
| Info | entity | Could not verify sameAs URL: https://x.com/RoozanehNet |  | Manually confirm this URL is accessible and correct. |
| Info | sameAs | Missing sameAs link to Wikipedia (Primary KG signal). |  | Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | sameAs | Missing sameAs link to Wikidata (Primary KG signal). |  | Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | sameAs | Missing sameAs link to LinkedIn (Strong KG signal). |  | Add 'linkedin.com' profile URL to sameAs array in your entity schema. |

## Measurement Notes

All configured checks completed without script-level errors.
