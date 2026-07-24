# UniMarg Website

Marketing website for **UniMarg Higher Education Consultancy**, Ahmedabad.

## Stack

Plain static HTML, CSS and JavaScript. No build step, no dependencies, no framework.
Open `index.html` in a browser to preview locally.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Home: hero, client wall, services overview, the UniMarg Way, why UniMarg |
| `services.html` | Ten practice areas with deliverables |
| `about.html` | Story, vision and mission, principles, leadership, career |
| `contact.html` | Contact details, map, enquiry form |
| `404.html` | Custom not-found page |
| `styles.css` | Shared design system for all pages |
| `script.js` | Mobile nav, scroll reveal, Formspree form handler |
| `vercel.json` | Canonical host redirect, security headers, cache policy, preview noindex |
| `robots.txt` | Crawl directives, sitemap pointer, explicit AI crawler allows |
| `sitemap.xml` | Four page URLs |
| `llms.txt` | Plain-text site summary for AI crawlers (experimental) |
| `og-image.png` | 1200x630 social share card |
| `favicon.ico`, `apple-touch-icon.png` | Site icons |

## Brand

| Token | Value |
|---|---|
| Blue | `#189FDA` |
| Blue (dark) | `#0F7EB2` |
| Gold | `#F2C10E` |
| Gold (deep) | `#D9AC00` |
| Ink | `#16303E` |
| Tint | `#F0F8FC` |

Fonts: Bricolage Grotesque (display), Archivo (body), both via Google Fonts.

## Deployment

Connected to Vercel. Any commit pushed to `main` deploys automatically.

## SEO / GEO / AEO

Audited with the `seo-geo-aeo` skill. Baseline before fixes: SEO 4/10, GEO 3/10,
AEO 2/10.

Implemented: canonical tags, Open Graph and Twitter cards, JSON-LD
(Organization/ProfessionalService, WebSite, LocalBusiness, BreadcrumbList,
ItemList of Services, FAQPage, Person), robots.txt, sitemap.xml, favicon set,
custom 404, security and cache headers, `fonts.gstatic.com` preconnect,
seven-question FAQ on the services page, heading-order fix on contact.

All canonical URLs and schema `@id` values use `https://unimarg.in`. If the
production host changes, update the head block of every HTML page plus
`sitemap.xml`, `robots.txt`, `llms.txt` and `vercel.json`.

## Open items

- [ ] **Point the `unimarg.in` domain here.** Canonical tags already declare it.
      Until DNS cuts over, `vercel.json` serves `X-Robots-Tag: noindex` on
      `*.vercel.app`, so the site will not be indexed anywhere.
- [ ] Add founder bios and credentials to the three leadership cards in
      `about.html`. They currently show a name and job title only, which is the
      weakest E-E-A-T signal on the site.
- [ ] Add `sameAs` social profile URLs (LinkedIn at minimum) to the Organization
      schema in `index.html`.
- [ ] Verify the FAQ answers in `services.html` are factually correct before the
      site goes live. They were drafted from existing site copy.
- [ ] Register the site in Google Search Console and Bing Webmaster Tools, submit
      the sitemap, and add GA4.
- [ ] Claim and complete the Google Business Profile for the Jagatpur office.
- [ ] Build out an Insights or Case Studies section. Total site content is around
      2,200 words, which is too thin to be cited by generative search engines.
- [ ] Optional: convert PNG/JPG assets to WebP (304KB total today).
- [ ] Optional: enable `"cleanUrls": true` in `vercel.json` to drop `.html` from
      URLs. Requires updating every internal link and breaks local file preview.
