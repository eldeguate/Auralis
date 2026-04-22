# AURALIS — Project Guide for Claude

## What this project is

AURALIS is a static marketing + e-commerce website for a bespoke hi-fi speaker workshop in Antigua, Guatemala. Speakers are handcrafted from Central American tonewoods. The site's centrepiece is an AI-powered consultation flow that recommends the right speaker after a short conversation.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Plain HTML + CSS + vanilla JS (no framework, no build step) |
| Fonts | Outfit (display), Libre Baskerville (serif), IBM Plex Mono |
| Backend | Supabase Edge Functions (Deno / TypeScript) |
| AI | Anthropic Claude via `@anthropic-ai/sdk` (streaming SSE) |
| Hosting | GitHub Pages (`eldeguate.github.io/Auralis`) |
| Email (planned) | Resend — API key to be added as Supabase secret `RESEND_API_KEY` |

---

## Repository layout

```
/
├── index.html          — Home / landing page
├── story.html          — Brand story
├── wood.html           — Tonewood guide
├── collection.html     — Speaker catalog (4 models)
├── consultation.html   — AI consultation + chat UI  ← main feature
├── contact.html        — Contact form
├── assets/
│   ├── styles.css      — Shared design tokens and components
│   ├── shared.js       — Nav, footer, scroll-reveal (injected on every page)
│   ├── data.js         — Speaker data / catalog
│   ├── speaker-visual.css
│   └── img/
└── supabase/
    └── functions/
        └── chat/
            └── index.ts  — Claude streaming chat Edge Function
```

---

## Design system

Tokens live in `assets/styles.css` `:root`:

| Token | Value | Use |
|---|---|---|
| `--cream` | `#F0EBE3` | Page background |
| `--parchment` | `#FAFAF7` | Card/panel background |
| `--slate` | `#2F3640` | Primary text |
| `--stone` | `#5A6068` | Secondary text |
| `--ash` | `#8A8F96` | Muted / labels |
| `--teal` | `#6B9B96` | Primary accent / CTA |
| `--teal-deep` | `#4A7B76` | Hover / active |
| `--jade` | `#5A8C6F` | Status / online indicator |
| `--f-display` | Outfit | Headlines, UI |
| `--f-serif` | Libre Baskerville italic | Subheadings, pull quotes |
| `--f-mono` | IBM Plex Mono | Labels, eyebrows, metadata |
| `--pad` | `clamp(24px,6vw,96px)` | Horizontal page padding |
| `--max` | `1360px` | Max content width |

**Never use hardcoded colour hex values in new code — always use the tokens.**

---

## The consultation flow (`consultation.html`)

This is the most complex page. Key behaviours:

- **6 steps:** Room → Listening Style → Music & Sources → Existing System → Recommendation → Order Summary
- Step state is tracked in JS (`currentStep`, `STEPS[]`). `setStep()` updates the sidebar, the mobile toggle label, and auto-collapses the steps drawer on mobile.
- **Chat messages** are `{role, content}` objects in `messages[]`. The greeting shown on screen is local-only and is NOT in `messages[]` (Claude API requires first message to be from user).
- **Streaming:** the Edge Function sends SSE (`data: {"text":"..."}` chunks). The frontend appends tokens to a bubble as they arrive.
- **Quick-reply buttons** appear after the opening greeting. They fill the input and call `sendMessage()`.
- **inferStep()** guesses which step the conversation is at based on keywords in the assistant's last reply and advances `currentStep`.

### Mobile layout (≤900px / ≤640px)
- Grid collapses to single column; chat has `order:1`, steps panel `order:2`
- Steps panel collapses to a toggle row showing current step (e.g. `01 · The Room ▾`)
- Toggle auto-closes when step advances
- Chat shell uses `flex:1` + `min-height: calc(100dvh - 220px)` so the input is always visible
- `font-size: 16px` on the input prevents iOS auto-zoom

---

## Edge Function: `supabase/functions/chat/index.ts`

- **Model:** `claude-haiku-4-5` with a cached system prompt
- **Env vars required:** `ANTHROPIC_API_KEY`, optionally `ALLOWED_ORIGIN` (defaults to `https://eldeguate.github.io`)
- **CORS:** allows `Authorization` and `apikey` headers — needed because Supabase anon key is sent from the browser
- **Limits:** max 30 messages, max 4000 chars per message
- Streams SSE events: `{text}` for tokens, `{done, usage}` on completion, `{error}` on failure

### System prompt structure

The system prompt is a single cached block (`cache_control: { type: "ephemeral" }`) organized top-to-bottom as:

1. `<role>` — sales-expert persona, craftsman-engineer voice, no-hallucination policy, custom-commission fallback, unspecified-field discipline.
2. `<catalog>` — the four Auralis models with specs. **Placeholder policy:** any spec marked `TODO: verify` is awaiting workshop measurement. The assistant must describe those attributes qualitatively only ("moderate sensitivity", "extends into the mid-30-hertz range") and never quote the placeholder number as a published spec. Prices, model names, wood species, and lead time (6–8 weeks) are fixed and may be stated directly.
3. `<decision_rules>` — explicit if/then mapping from client profile to model, with hard-constraint overrides (amp type, placement) and a fallback to the custom commission.
4. `<intake_schema>` — internal scratchpad of canonical client-profile fields. Missing values are tracked as the literal `"unspecified"` internally and never printed or spoken to the user.
5. `<output_contract>` — prose-only SSE output rules, sentence-length targets per step, recommendation format, redirects for discount/shipping/out-of-scope questions.

The chat UI, step logic, quick-replies, and `inferStep()` in `consultation.html` depend on the existing SSE wire format only — changes to prompt content must preserve the `{text}` / `{done,usage}` / `{error}` event shape.

### Deploying the Edge Function
```bash
supabase functions deploy chat --project-ref awytafjpzovrexswkeup
```

---

## Planned: email + download feature

At the recommendation step, a panel should appear allowing the user to:
1. **Download** — print-formatted recommendation card (browser `window.print()`)
2. **Email** — sends a formatted HTML email via a new `send-recommendation` Edge Function using Resend

### To implement this you need:
- A Resend account and API key
- Add secret: `supabase secrets set RESEND_API_KEY=re_...`
- Create `supabase/functions/send-recommendation/index.ts`
- Sending domain: `auralis.gt` (DNS records from Resend dashboard)
- From address: `hola@auralis.gt`

---

## Local development

No build step needed. Serve the root directory:

```bash
cd "/Users/rs/Downloads/Auralis Website"
python3 -m http.server 8080
# open http://localhost:8080
```

For phone testing on local network:
```bash
# your Mac's IP (en0)
ipconfig getifaddr en0
# open http://192.168.x.x:8080/consultation.html on phone
```

---

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`:
- **Live URL:** `https://eldeguate.github.io/Auralis/`
- Branch: `main`, root path `/`
- Pages usually rebuild within ~60 seconds of a push

```bash
git add <files>
git commit -m "..."
git push origin main
```

---

## Speaker catalog (quick reference)

| Model | Price | Type | Best for |
|---|---|---|---|
| **TZ'IKIN** | $1,800/pr | Powered desktop monitor, Cocobolo | Desktop, very small rooms |
| **IXCHEL** | $2,400/pr | Bookshelf monitor, Granadillo | Studies, bedrooms, near-field |
| **K'UHUL** | $5,200/pr | Floor-standing tower, Hormigo | Mid–large living rooms |
| **BALAM** | $7,800/pr | Open-baffle dipole flagship, Conacaste | Audiophile / vinyl / critical listening |

Lead time: 6–8 weeks, built to order. No discounts. Lifetime workshop support.

---

## Supabase project ref

`awytafjpzovrexswkeup` — used in Edge Function URLs and CLI commands.
