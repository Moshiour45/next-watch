# NextWatch

A cinematic movie and TV show discovery web app powered by the TMDB API. Designed with a premium dark theme, glassmorphism aesthetics, and a fully responsive layout.

![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

NextWatch lets users explore trending movies and TV shows, search across thousands of titles, and dive deep into detailed information — all from a single, beautifully crafted interface. Every interaction is designed to feel fast and cinematic.

---

## Features

- **Trending Feed** — Weekly trending movies and TV shows loaded on page load via TMDB's trending endpoint.
- **Live Search** — Debounced multi-search across movies, TV shows, and people with instant results.
- **Detail Modal** — Rich modal view for any title featuring:
  - Poster, rating, certification (age rating), status, release year
  - Tagline, genres, director/creator, runtime or network info
  - Official YouTube trailer link
  - IMDb external link
  - Streaming provider icons (US region)
  - Production studio logos
  - Top 4 cast members with profile photos
  - "You Might Also Like" recommendations
- **TV Episodes Guide** — For TV shows: custom season dropdown with per-season episode listing, including thumbnails, air dates, ratings, and runtime.
- **Responsive Design** — Fully responsive grid (1–5 columns) with mobile-optimized card layout and modal.
- **Keyboard Accessible** — Escape key closes modal, Enter triggers search.
- **Abort Controller** — Cancels in-flight search requests when new input arrives. No stale results.

---

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Bundler   | Vite 8                      |
| Styling   | Tailwind CSS 4 (via Vite plugin) |
| Logic     | Vanilla JavaScript (ES Modules) |
| API       | [TMDB API v3](https://developer.themoviedb.org/docs) |

No frameworks. No React, Vue, or Angular. Pure vanilla JS with modern ES module syntax.

---

## Project Structure

```
next-watch/
├── index.html          # Main HTML — navbar, hero/search, results grid, detail modal
├── vite.config.js      # Vite config with Tailwind CSS plugin
├── package.json        # Dependencies and scripts
├── public/
│   ├── favicon.svg     # Custom play-button favicon (teal)
│   └── icons.svg       # SVG icon sprite
├── src/
│   ├── style.css       # Tailwind CSS import entry point
│   ├── main.js         # All application logic (~690 lines)
│   └── counter.js      # Vite scaffold leftover (unused)
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free TMDB API key — [get one here](https://www.themoviedb.org/settings/api)

### Installation

```bash
git clone https://github.com/Moshiour45/next-watch.git
cd next-watch
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_KEY=your_tmdb_api_key_here
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

### Production Build

```bash
npm run build
npm run preview
```

---

## API Usage

All data comes from [TMDB API v3](https://developer.themoviedb.org/docs). Endpoints used:

| Endpoint | Purpose |
|----------|---------|
| `/trending/all/week` | Weekly trending movies and TV shows |
| `/search/multi` | Multi-search across movies, TV, and people |
| `/movie/{id}` | Movie details with credits, videos, certifications, providers, similar |
| `/tv/{id}` | TV details with credits, videos, content ratings, providers, similar |
| `/tv/{id}/season/{num}` | Season episode listing |

All detail requests use `append_to_response` to batch sub-resources into a single API call.

---

## Design Highlights

- **Dark glassmorphism** — `backdrop-blur`, translucent backgrounds, slate-950 base
- **Teal accent system** — Teal-400/500 for interactive elements, ratings, hover states
- **Card hover effects** — Scale, translate, glow shadow, border color transitions
- **Gradient overlays** — Poster cards use multi-stop gradients for text readability
- **Custom scrollbars** — Thin teal-styled scrollbars on episode lists and similar sections
- **Radial background gradient** — Full-page `radial-gradient` from slate-900 through black

---

## License

MIT

---

## Acknowledgments

- Movie and TV data provided by [TMDB](https://www.themoviedb.org/)
- Built with [Vite](https://vite.dev/) and [Tailwind CSS](https://tailwindcss.com/)
