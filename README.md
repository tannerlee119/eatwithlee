# Eat with Lee 🍽️

A modern food blogging website featuring restaurant reviews, ratings, and location-based discovery.

## Features

- **Clean, Light-Themed Design**: Aesthetic layout inspired by news websites with a focus on readability
- **Restaurant Reviews**: Detailed reviews with ratings, photos, and location information
- **Interactive Maps**: View restaurant locations on maps with Google Maps integration
- **Tag System**: Filter by cuisines, vibes, and food types
- **Favorite Dishes**: Highlighted must-try dishes for each restaurant
- **Admin Dashboard**: Separate management system for adding and editing reviews
- **Social Integration**: Links to Instagram and Beli profiles

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter (body), Playfair Display (headings)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages
  - `/reviews/[slug]` - Individual review pages
  - `/admin` - Admin dashboard for adding reviews
  - `/about` - About page
- `/components` - Reusable React components
- `/lib` - Utilities and data structures
  - `types.ts` - TypeScript type definitions
  - `reviews.ts` - Review data and functions
- `/public/images` - Image assets

## Admin Dashboard

Access the admin dashboard at `/admin` to add new restaurant reviews. The form includes:
- Basic information (name, title, rating, content)
- Location details (address, coordinates)
- Tags (cuisines, vibes, food types)
- Favorite dishes

## Production Database Setup

**IMPORTANT**: SQLite (current setup) does NOT persist on Vercel/Netlify. For production, choose one:

### Option 1: Vercel Postgres (Recommended if using Vercel)
1. Go to your Vercel project → Storage → Create Database → Postgres
2. Copy the `DATABASE_URL` to your `.env`
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run: `npx prisma migrate dev --name postgres_migration`
5. Deploy!

### Option 2: Supabase (Free tier, works everywhere)
1. Create account at https://supabase.com
2. Create new project → Get connection string
3. Add to `.env`: `DATABASE_URL="postgresql://..."`
4. Update `prisma/schema.prisma` provider to `postgresql`
5. Run: `npx prisma migrate dev`

### Option 3: Neon (Generous free tier)
1. Sign up at https://neon.tech
2. Create database → Copy connection string
3. Follow same steps as Supabase

### Option 4: PlanetScale (MySQL-based)
1. Sign up at https://planetscale.com
2. Create database
3. Update provider to `mysql` in schema
4. Connect and migrate

## Next Steps

- [x] Add image upload functionality
- [x] Implement address geocoding
- [x] Add image carousel
- [ ] Switch to production database (see above)
- [ ] Implement pagination for reviews
- [ ] Add search functionality
- [ ] Add authentication for admin dashboard
- [ ] Implement filtering by tags
- [ ] Add social sharing features

## Color Palette

- Primary: `#FF6B35` (Coral)
- Secondary: `#F7C59F` (Peach)
- Accent: `#EFEFD0` (Cream)

## License

Personal project - All rights reserved