# Sandhouse Hospitality concept

A presentation demo by Basically, using Sandhouse Hospitality's existing brand identities and website information. Built with React, TypeScript, Vite, Motion and Radix Dialog.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:5173. The development server also prints a local-network URL for showing the demo on a phone connected to the same Wi-Fi.

```sh
npm run build
npm run preview
```

The production website is in `dist/`. Configure a static host to serve `index.html` for the site's page routes. A Netlify-style `_redirects` file is included.

## Experience

- Full-width hero using the group's existing food-preparation footage, interactive brand discovery, a story timeline and an outlet finder.
- Separate pages at the existing `/sandburgs/`, `/the-canteen-project/`, `/sandhouse/`, `/about-us/` and `/contact-us/` paths.
- Brand ordering links taken from the official website, opening Zomato.
- Outlet filtering by brand and city, with directions links and a useful empty state.
- Mobile navigation, keyboard-accessible dialogs, light and dark appearances, and reduced-motion support.
- The original food video, two silent food motion loops and a downloadable branded film, all stored locally.

## Brand colors

The redesign uses the colors extracted from the live website's Elementor styles and original logos, recorded in `sources/brand-color-audit.json`:

- Sandhouse Hospitality: charcoal `#191A19` and orange `#EF7F1A`.
- Sandburgs: red `#D94328` with its existing cream `#FFFAED`.
- The Canteen Project: red `#D5433A`, logo yellow `#ECB722` and cream.
- Sandhouse All Day Diner: brown `#854617` and cream.

Charcoal and orange unify the group navigation, homepage and footer. Brand tabs, showcase panels, individual pages and film graphics retain each restaurant's own palette. Darker red variants provide readable small text and button labels against light backgrounds. The original logos retain their colors. The group defaults to its existing dark identity, with a manual light appearance available.

## Source information

Content and original logos/photography were sourced from:

- https://sandhousehospitality.com/
- https://sandhousehospitality.com/about-us/
- https://sandhousehospitality.com/sandburgs/
- https://sandhousehospitality.com/the-canteen-project/
- https://sandhousehospitality.com/sandhouse/
- https://sandhousehospitality.com/contact-us/

The fetched source snapshot is in `sources/official-site.json`; asset provenance is in `sources/asset-manifest.json`. The source of the original hero footage is recorded in `sources/motion-assets.json`.

This is a concept for a pitch, not a previous client case study. Placeholder telephone numbers, unfinished copy and example locations from the source were excluded. Published dining hours conflict between sources, so this demo does not state dining or delivery hours. The contact page explicitly identifies the published hours as office hours. Outlet information and ordering destinations should be confirmed with the business before a production launch.

## Creative assets

The three new food photographs are AI-generated creative concepts based on official image references. They illustrate a proposed art direction for an original food shoot; they are not photographs taken by Basically at the restaurants. Original high-resolution PNGs are in `sources/generated/`; optimized website versions are in `public/assets/`. Complete built-in image-generation prompts and generation records are saved in `sources/food-asset-prompts.json` and `sources/diner-pizza-prompt.json`.

Runway's connected workspace does not support video generation. The hero uses the food-preparation footage already published on Sandhouse Hospitality's homepage, compressed locally for web playback. The other MP4s are custom motion graphics composed using FFmpeg from concept stills and official imagery, with camera motion, brand typography and transitions. They contain no synthetic restaurant footage or audio.

- `public/assets/burger-loop.mp4`
- `public/assets/canteen-loop.mp4`
- `public/assets/sandhouse-film.mp4`
- `public/assets/official-food-loop.mp4`

To prepare images and reproduce the motion assets:

```sh
npm run assets:prepare
npm run assets:motion
```

Cabinet Grotesk and Supreme are served locally, sourced from [Fontshare](https://www.fontshare.com/). The requested taste-skill repository is installed in `.agents/skills/`. The redesign uses native CSS, six-pixel controls, square imagery, food-film motion and the existing brand colors. Existing logos and route names are retained.

For the call, start with the homepage, open the ordering panel, filter the outlet finder, then show one brand page and the film. These demonstrate food content, website development and customer journeys in one short walkthrough.
