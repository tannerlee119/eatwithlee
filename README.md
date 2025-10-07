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

## Next Steps

- [ ] Connect to a database (e.g., Supabase, MongoDB)
- [ ] Add image upload functionality
- [ ] Implement pagination for reviews
- [ ] Add search functionality
- [ ] Integrate live Google Maps API
- [ ] Add authentication for admin dashboard
- [ ] Implement filtering by tags
- [ ] Add social sharing features

## Color Palette

- Primary: `#FF6B35` (Coral)
- Secondary: `#F7C59F` (Peach)
- Accent: `#EFEFD0` (Cream)

## License

Personal project - All rights reserved