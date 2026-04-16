# Fred

Fred is a premium educational banking app concept for German families with children aged 8-18.

The product idea is simple:

- children get a real debit card experience
- parents stay in control of money, rules, and visibility
- pocket money is unlocked only after financial literacy lessons and quizzes are completed

This repository contains the marketing landing page for Fred, built as a polished single-page experience with bilingual content, premium motion, and a strong parent-trust story.

## What This Landing Page Covers

The page is designed to communicate three things clearly:

- Fred teaches kids how money actually works
- parents keep oversight and control
- the experience feels modern, premium, and trustworthy

Current sections include:

- fixed navbar with EN/DE toggle
- hero section with phone mockup and cinematic motion
- how it works
- lesson showcase
- parent dashboard preview
- pricing
- FAQ
- final waitlist CTA
- footer

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lenis smooth scroll
- GSAP + ScrollTrigger

## Project Structure

- `src/App.tsx`
  Main landing page shell, hero, navbar, and shared EN/DE copy object.
- `src/components/`
  Reusable landing page sections and UI pieces.
- `public/`
  Static files such as `robots.txt`, `sitemap.xml`, and manifest assets.

## Localization

The site supports English and German.

All landing page copy lives in the shared `copy` object inside `src/App.tsx`. Components receive only the subset of content they need through props. If you want to edit text, this is the first place to check.

## Waitlist CTA

All waitlist buttons are centralized through:

- `src/components/WaitlistButton.tsx`

That file holds the Tally form URL so it only needs to be updated once.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build For Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## SEO / Share Preview Setup

The app includes a deployment-ready metadata layer for:

- browser title and description
- Open Graph sharing
- Twitter card sharing
- robots.txt
- sitemap.xml
- web manifest

Before production launch, add the missing brand assets in `public/`, especially:

- `og-image.jpg`
- favicon files
- touch icons

## Notes For Future Edits

- Keep the Tally URL only in `WaitlistButton.tsx`
- Keep translations inside `App.tsx`
- Preserve the mobile-first layout and premium spacing system
- Prefer transform/opacity-based animation over heavy visual effects
