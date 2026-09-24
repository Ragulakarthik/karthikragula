# karthikragula

**Live:** [karthikragula.vercel.app](https://karthikragula.vercel.app)

A personal video hub for Karthik Ragula's YouTube channel. Instead of scattering
placement-prep content across playlists, this site organizes every video into
dedicated sheets so viewers can find exactly what they need and track what
they've already watched.

## What's on the site

- **Companies** — company-wise interview experiences and prep videos (Infosys,
  Accenture, Cognizant, LTI Mindtree, Capsitech, ...), browsable as an
  accordion per company.
- **DSA** — LeetCode problems solved in Java, explained in Telugu, grouped into
  an accordion by topic (Arrays & Hashing, Two Pointers, Sliding Window,
  Stack, Intervals, Strings, Greedy, Math & Bit Manipulation).
- **Resume** — resume-building tips for freshers.
- **Career Tips** — roadmaps, certifications, and internship advice.
- **Miscellaneous** — other long-form videos (temples, food, dance) grouped
  the same way.

## Features

- **Progress tracking** — tick any video as watched; progress is saved in the
  browser (no login) and reflected live in a fixed sidebar tracker with an
  overall completion ring and a per-category breakdown.
- **Accordions** — Companies, DSA, and Miscellaneous each expand/collapse by
  group instead of a flat list, with search that auto-expands matching groups.
- **Ask Me Anything chat** — a floating chat assistant (plus a full-page view at
  `/chat`) that answers questions from the channel's videos, streamed in real
  time. Backed by [ask-my-channel](https://github.com/Ragulakarthik/ask-my-channel).
- **Share previews & SEO** — generated preview images for the home page and
  each sheet (shown when a link is shared on WhatsApp, LinkedIn, X, etc.),
  canonical URLs, `sitemap.xml`, and `robots.txt`.
- **Light/dark theme** toggle, remembered per browser.
- **Collapsible left navigation** with active-page highlighting.
- **Responsive layout** — sidebar and tracker on desktop, stacked layout on
  mobile.

## Tech stack

Next.js (App Router) + React + Tailwind CSS. Video metadata lives in
`src/data/videos.json`; per-video progress is stored client-side in
`localStorage` — no login or database.

The chat goes through `src/app/api/chat/route.js`, a same-origin proxy that
streams answers from the ask-my-channel backend, so the browser never calls
the backend directly.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

The chat needs an ask-my-channel backend. Create `.env.local`:

```bash
# Deployed backend, or http://localhost:8080 if running ask-my-channel locally
ASK_MY_CHANNEL_URL=https://ask-my-channel.onrender.com
ASK_MY_CHANNEL_HANDLE=@karthikragula6666
```

Everything else works without it; the chat just shows a "backend isn't
reachable" message.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ASK_MY_CHANNEL_URL` | Base URL of the ask-my-channel backend (defaults to `http://localhost:8080`) |
| `ASK_MY_CHANNEL_HANDLE` | YouTube channel handle the chat answers from |
| `SITE_URL` | Optional. Public site URL for canonical links, sitemap and share previews. On Vercel it defaults to the production domain |

## Deployment

- **Site:** Vercel, deployed automatically from `main`. Set `ASK_MY_CHANNEL_URL`
  and `ASK_MY_CHANNEL_HANDLE` in the project's environment variables, then
  redeploy.
- **Chat backend:** ask-my-channel runs separately on Render's free plan, so
  the first chat message after it's been idle can take 30–60 seconds while it
  wakes up.
