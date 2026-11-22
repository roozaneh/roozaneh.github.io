# Action Plan

- URL: `https://roozaneh.github.io/`
- Overall score: `74/100`

## Priority Fixes

1. **5 security headers missing**
   - Priority: `Critical`
   - Area: `environment`
   - Evidence: Missing headers reduce trust and can expose the site to browser/security risks.
   - Fix: Set security headers in `next.config.js` `headers()` or at your edge/CDN.
2. **6 broken links detected**
   - Priority: `Critical`
   - Area: `environment`
   - Evidence: Broken internal links hurt crawl flow and user trust.
   - Fix: Fix links in route components and content source files; validate with link checks in CI.
3. **No Wikidata entry found for 'روزنه (Roozaneh Network)'.**
   - Priority: `Info`
   - Area: `Wikidata`
   - Evidence: See audit output.
   - Fix: If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO.
4. **No Wikipedia article found for 'روزنه (Roozaneh Network)'.**
   - Priority: `Info`
   - Area: `Wikipedia`
   - Evidence: See audit output.
   - Fix: Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals.
5. **Could not verify sameAs URL: https://t.me/RoozanehHelp**
   - Priority: `Info`
   - Area: `entity`
   - Evidence: See audit output.
   - Fix: Manually confirm this URL is accessible and correct.
6. **Could not verify sameAs URL: https://x.com/RoozanehNet**
   - Priority: `Info`
   - Area: `entity`
   - Evidence: See audit output.
   - Fix: Manually confirm this URL is accessible and correct.
7. **Performance measurement incomplete**
   - Priority: `Info`
   - Area: `environment`
   - Evidence: PageSpeed API returned an error, so CWV recommendations are less reliable.
   - Fix: Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output.
8. **Missing sameAs link to Wikipedia (Primary KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add the existing official 'wikipedia.org' URL to sameAs; do not create this profile solely for SEO.
9. **Missing sameAs link to Wikidata (Primary KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add the existing official 'wikidata.org' URL to sameAs; do not create this profile solely for SEO.
10. **Missing sameAs link to LinkedIn (Strong KG signal).**
   - Priority: `Info`
   - Area: `sameAs`
   - Evidence: See audit output.
   - Fix: Add 'linkedin.com' profile URL to sameAs array in your entity schema.
