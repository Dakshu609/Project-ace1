# Project Ace

A modern freelance coding marketplace built with Next.js. Hire developers, browse services, post jobs, and manage projects — clients and freelancers in one platform.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix primitives)
- **Supabase** (Auth + PostgreSQL)
- **Framer Motion**
- **Lucide React**
- **next-themes** (dark / light mode)

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configure environment variables

Create `.env.local` in the project root (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the database schema

In the Supabase Dashboard, open **SQL Editor** and run the contents of:

```
supabase/schema.sql
```

This creates the `profiles` table, row-level security policies, and a trigger to auto-create a profile when a user signs up.

### 4. Enable Google OAuth (optional)

1. In Supabase: **Authentication → Providers → Google** — enable and add your Google OAuth client ID/secret.
2. In Google Cloud Console, add authorized redirect URI:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
3. In Supabase: **Authentication → URL Configuration**, set:
   - **Site URL**: `http://localhost:3000` (production: your domain)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. Email auth settings

Under **Authentication → Providers → Email**, enable email signups. For local dev you can disable "Confirm email" to skip verification, or use the confirmation link from Supabase logs.

## Authentication Features

| Feature | Description |
|---------|-------------|
| Email login | Sign in with email + password |
| Email signup | Register with name, email, password, and role |
| Google OAuth | One-click sign in / sign up |
| Role selection | Client or Freelancer — chosen at signup or after Google OAuth |
| Protected routes | `/dashboard/*`, `/messages`, `/admin` require login |
| Session persistence | Cookie-based sessions via `@supabase/ssr` |
| User profiles | Stored in Supabase `profiles` table |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, search, categories, freelancers, FAQ, pricing |
| `/freelancers` | Browse & filter freelancers |
| `/freelancers/[id]` | Freelancer profile, portfolio, reviews |
| `/services` | Browse fixed-price services |
| `/post-job` | Post a new project |
| `/auth` | Login & signup |
| `/auth/role` | Role selection (after Google OAuth) |
| `/dashboard/client` | Client dashboard (protected) |
| `/dashboard/freelancer` | Freelancer dashboard (protected) |
| `/messages` | Chat UI (protected) |
| `/admin` | Admin dashboard (protected) |

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Public pages with footer
│   ├── (app)/           # App shell (no footer)
│   └── auth/callback/   # OAuth callback handler
├── components/
│   ├── auth/            # Login, signup, Google, role selector
│   ├── home/            # Homepage sections
│   ├── layout/          # Navbar, footer, user nav
│   └── dashboard/       # Dashboard layout & sidebar
├── lib/
│   ├── auth/            # Server actions & utils
│   ├── supabase/        # Supabase clients & types
│   └── data/mock.ts     # Sample marketplace data
└── middleware.ts        # Session refresh & route protection
supabase/
└── schema.sql           # Database schema
```

## Mock Data

Marketplace listing data lives in `src/lib/data/mock.ts`. User accounts and profiles are stored in Supabase.

## Build

```bash
npm run build
npm start
```

Requires valid `NEXT_PUBLIC_SUPABASE_*` env vars in `.env.local` for auth middleware and protected routes.
