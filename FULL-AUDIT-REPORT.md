# Full Audit Report

- URL: `https://roozaneh.github.io/`
- Generated: `2026-11-22T03:28:09.592218`
- Overall score: `68/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 45 |
| Social Meta | 5 | 85 |
| Robots and Crawlers | 8 | 90 |
| Broken Links | 10 | 0 |
| Internal Links | 8 | 60 |
| Redirects | 3 | 100 |
| AI Search | 5 | 90 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 100 |
| Entity SEO | 5 | 0 |
| Link Profile | 7 | 75 |
| Hreflang | 5 | 0 |
| Content Uniqueness | 5 | 100 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | Schema | No Organization/Person entity found in JSON-LD. |  | Add Organization or Person schema with name, url, logo, and sameAs properties. |
| Critical | broken_links | 🔴 6 broken link(s) found |  |  |
| Critical | environment | 5 security headers missing | Missing headers reduce trust and can expose the site to browser/security risks. | Set security headers in `next.config.js` `headers()` or at your edge/CDN. |
| Critical | environment | 6 broken links detected | Broken internal links hurt crawl flow and user trust. | Fix links in route components and content source files; validate with link checks in CI. |
| Critical | security | 🔴 5 security headers missing — poor security posture |  |  |
| Warning | internal_links | ⚠️ 1 page(s) have fewer than 3 internal links |  |  |
| Warning | internal_links | ⚠️ 1 link(s) have no anchor text |  |  |
| Warning | readability | ⚠️ Thin content (79 words) — may rank poorly |  |  |
| Warning | robots | ⚠️ 6 AI crawlers not explicitly managed: Applebot-Extended, Bytespider, CCBot, anthropic-ai, FacebookBot |  |  |
| Warning | security | ⚠️ HSTS missing includeSubDomains directive |  |  |
| Info | Wikidata | No Wikidata entry found for 'روزنه (Roozaneh)'. |  | If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'روزنه (Roozaneh)'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |
| Info | sameAs | Missing sameAs link to Wikipedia (Primary KG signal). |  | Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | sameAs | Missing sameAs link to Wikidata (Primary KG signal). |  | Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO. |
| Info | sameAs | Missing sameAs link to LinkedIn (Strong KG signal). |  | Add 'linkedin.com' profile URL to sameAs array in your entity schema. |
| Info | sameAs | Missing sameAs link to Twitter/X (Strong KG signal). |  | Add 'x.com' profile URL to sameAs array in your entity schema. |

## Measurement Notes

1 checks returned errors or incomplete measurements; treat affected scores as directional.
