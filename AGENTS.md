# Roozaneh Network - AI Agents & Coding Assistants Guide (`AGENTS.md`)

This repository hosts the official landing page and web infrastructure for **Roozaneh Network (روزنه)**.
Website: https://roozaneh.github.io/
Organization: https://github.com/roozaneh

---

## 1. Project Purpose & Architecture
Roozaneh Network provides high-speed, anti-censorship, stable tunneling services (VLESS Reality, V2Ray) with dedicated European server infrastructure.

### File Structure:
- `index.html`: The core landing page. Completely static and hydration-free.
- `landing.js`: Standalone lightweight vanilla JavaScript handling the pricing calculator, interactive plan sliders, theme toggles, and modals.
- `.nojekyll`: Required for GitHub Pages to preserve `_next/` directories.
- `llms.txt` & `llms-full.txt`: Standardized AI Search & LLM discovery specifications.
- `robots.txt` & `sitemap.xml`: Multi-repository SEO and bot directives.
- `sitemap_index.xml` & `sitemap-index.xml`: Sitemap discovery index aliases.
- `og.png`, `apple-touch-icon.png`, `favicon.ico`: Brand visual identity assets.

---

## 2. Core Guidelines for AI Agents Working on This Repository
1. **Persian RTL Formatting:**
   - All Persian textual content must be properly formatted with RTL alignment (`dir="rtl"`) and use the `IRANSansX` / `Vazirmatn` font stack.
2. **Confidentiality & Anti-Leak Protocol:**
   - NEVER commit or expose server IPs, credentials, bot API tokens, private keys, or customer records in public git history.
   - Internal handoff documentation (`HANDOFF.md`) must be kept in `.gitignore`.
3. **No Dynamic Build Overhead:**
   - The repository is designed to be served directly as static HTML/CSS/JS via GitHub Pages. Do not introduce mandatory heavy build steps or runtime node servers unless explicitly requested.
4. **Programmatic SEO Network:**
   - The organization `roozaneh` uses multiple repositories served as subpaths under `roozaneh.github.io/`:
     - `/kharid-vpn-filter-shekan/`
     - `/v2ray-configs-iran/`
     - `/iran-tunnel-v2ray-netmeli/`
     - `/v2ray-clients-download/`

---

## 3. Contact & Official Governance
- Official Bot: [@RoozanehNetBot](https://t.me/RoozanehNetBot)
- 24/7 Human Customer Support: [@RoozanehHelp](https://t.me/RoozanehHelp)
- Official Channel: [@RoozanehNet](https://t.me/RoozanehNet)
- Official X / Twitter: [@RoozanehNet](https://x.com/RoozanehNet)
