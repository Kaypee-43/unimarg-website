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
| `styles.css` | Shared design system for all pages |
| `script.js` | Mobile nav, scroll reveal, form handler |

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

## Open items

- [ ] Enquiry form does not deliver anywhere. Wire `script.js` to a CRM webhook or Formspree endpoint.
- [ ] Second co-founder card in `about.html` is a placeholder. Fill or remove.
- [ ] Kandarp Pandya bio in `about.html` is a placeholder.
- [ ] Client wall is text only. Replace with logo tiles when the logo files are added.
- [ ] Point the `unimarg.in` domain here once content is signed off.
