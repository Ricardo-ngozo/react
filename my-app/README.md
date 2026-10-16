# SIDELINE

A football management preparation experience built with React, React Router and Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. Careers save in that browser and origin.

## What is available

- Cinematic title and main menu, a shared charcoal/lime design system, responsive layouts and consistent SVG icons.
- 94 curated club choices across six nations and eight competition collections, with filters, profile comparisons and guided career setup.
- Five distinct optimized manager portraits and correctly assigned stadium, tunnel and office imagery.
- Career library, persistent setup drafts, rename/delete controls and validated JSON backup export/import.
- Headquarters overview with an actionable preparation checklist and club project milestones.
- 24 fictional squad members per club, player reports, captain selection and squad search/filter/sort.
- Six formations, interactive position assignments, player roles, team instructions, assistant selection and named tactical presets.
- A six-day training planner with saved intensity and a transparent planning-load estimate.
- Illustrative friendly and home/away league fixture lists, calendar navigation, filters, opponent briefings and saved fixture notes.
- Scouting reports, estimated/exact ratings, persistent shortlists, staff inbox and a manager notebook.
- Appearance, contrast, interface scale, reduced motion, density and preparation preferences that apply throughout the interface.

## Scope

This is an interactive preparation preview. Match simulation, date advancement, live squads, transfer negotiations and season progression are not implemented. Squad names/attributes, scouting estimates, opponent analysis and fixtures are fictional or illustrative. Competition collections do not assert current real-world league membership. Club crests are original monograms, not official club artwork.

## Checks

```sh
npm run build
npm run lint
npm test
```

Tests cover club integrity, all formation/selection combinations, lineup recovery, fixture ordering and home/away balance, save import validation and image paths.

## Source map

- `src/styles/app.css`: design system, screen styles, breakpoints and motion preferences.
- `src/components/hq/`: squad, tactics, fixtures, training, scouting, office, projects and notebook.
- `src/data/football.js`: deterministic fictional squads, formation slots and illustrative schedules.
- `src/data/persistence.js`: imported/stored career validation and normalization.
- `src/context/GameContext.jsx`: browser persistence and shared preferences.
- `src/data/assets.js`: visually audited image manifest and legacy avatar aliases.

Original image assets are retained. Active screens use the optimized WebP copies in `public/assets/optimized/`.
