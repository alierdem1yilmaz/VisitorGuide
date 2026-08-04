# VisitorGuide

Travel discovery platform — browse countries and cities to find restaurants, attractions, monuments, hotels, and natural landmarks, with photos, ratings, and honest reviews.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v3
- Prisma ORM + PostgreSQL (Supabase)
- next-intl (TR / EN / DE / FR / RU / ZH)
- NextAuth.js (planned)
- Google Maps JavaScript API + Places API (planned)

## Getting started

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` / `DIRECT_URL` (Supabase project credentials).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the first migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

Inspect the database with `npx prisma studio` (http://localhost:5555).
