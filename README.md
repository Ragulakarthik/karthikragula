# karthikragula.com

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
- **Collapsible left navigation** with active-page highlighting.
- **Responsive layout** — sidebar and tracker on desktop, stacked layout on
  mobile.

## Tech stack

Next.js (App Router) + React + Tailwind CSS. Video metadata lives in
`src/data/videos.json`; per-video progress is stored client-side in
`localStorage` — no backend or database.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.
