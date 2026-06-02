# Project Ace

A modern freelance coding marketplace built with Next.js. Hire developers, browse services, post jobs, and manage projects — clients and freelancers in one platform.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix primitives)
- **Framer Motion**
- **Lucide React**
- **next-themes** (dark / light mode)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, search, categories, freelancers, FAQ, pricing |
| `/freelancers` | Browse & filter freelancers |
| `/freelancers/[id]` | Freelancer profile, portfolio, reviews |
| `/services` | Browse fixed-price services |
| `/post-job` | Post a new project |
| `/auth` | Login & signup |
| `/dashboard/client` | Client dashboard |
| `/dashboard/freelancer` | Freelancer dashboard |
| `/messages` | Chat UI |
| `/admin` | Admin dashboard |

## Project Structure

```
src/
├── app/              # App Router pages
├── components/
│   ├── home/         # Homepage sections
│   ├── freelancers/  # Cards, filters
│   ├── layout/       # Navbar, footer, theme
│   ├── dashboard/    # Dashboard sidebar
│   ├── shared/       # Reusable UI helpers
│   └── ui/           # shadcn-style primitives
└── lib/
    ├── data/mock.ts  # Sample data (ready for API swap)
    └── types/        # TypeScript models
```

## Mock Data

All data lives in `src/lib/data/mock.ts` with typed models in `src/lib/types/`. Replace with API calls when connecting a backend.

## Build

```bash
npm run build
npm start
```
