# AURALIS

**Bespoke hi-fi speakers, handcrafted in Antigua, Guatemala from Central American tonewoods.**

🌐 **Live site:** [eldeguate.github.io/Auralis](https://eldeguate.github.io/Auralis/)

---

## About

AURALIS is the marketing and consultation site for a small speaker workshop. The catalog is four models — TZ'IKIN, IXCHEL, K'UHUL, and BALAM — each built from a different Central American hardwood. The centrepiece of the site is an AI-powered consultation flow that recommends the right speaker after a short conversation about your room, listening style, and music.

## The catalog

| Model | Price | Type | Wood |
|---|---|---|---|
| TZ'IKIN | $1,800 / pair | Powered desktop monitor | Cocobolo |
| IXCHEL | $2,400 / pair | Bookshelf monitor | Granadillo |
| K'UHUL | $5,200 / pair | Floor-standing tower | Hormigo |
| BALAM | $7,800 / pair | Open-baffle dipole flagship | Conacaste |

Lead time is typically around 6–8 weeks, built to order. Bespoke commissions are also available — every variable on the table.

## Pages

- `index.html` — home
- `story.html` — the workshop's story
- `wood.html` — tonewood guide
- `collection.html` — four models + bespoke professional
- `consultation.html` — AI consultation chat
- `contact.html` — contact form

## Tech stack

- **Frontend:** plain HTML + CSS + vanilla JS (no framework, no build step)
- **Backend:** Supabase Edge Functions (Deno / TypeScript)
- **AI:** Anthropic Claude (`claude-haiku-4-5`) streaming via SSE
- **Hosting:** GitHub Pages

## Local development

No build step. Serve the root directory:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`. Rebuilds usually finish within ~60 seconds.

## For developers / agents

See [`CLAUDE.md`](./CLAUDE.md) for the full project guide — tech stack, design tokens, edge function architecture, and the consultation flow's internal logic.

---

© AURALIS · Antigua, Guatemala
