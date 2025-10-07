import { Review } from './types';

// Mock data - will be replaced with database later
export const reviews: Review[] = [
  {
    id: '1',
    title: 'An Unforgettable Experience at Nobu Malibu',
    restaurantName: 'Nobu Malibu',
    slug: 'nobu-malibu-review',
    excerpt: 'Stunning ocean views meet exceptional Japanese-Peruvian fusion cuisine in this iconic Malibu destination.',
    content: 'Full review content goes here...',
    rating: 9.5,
    images: ['/images/placeholder.jpg'],
    coverImage: '/images/placeholder.jpg',
    location: {
      address: '3835 Cross Creek Rd, Malibu, CA 90265',
      lat: 34.0352,
      lng: -118.6802
    },
    tags: {
      cuisines: ['Japanese', 'Peruvian', 'Fusion'],
      vibes: ['Upscale', 'Ocean View', 'Date Night'],
      foodTypes: ['Sushi', 'Seafood']
    },
    favoriteDishes: ['Black Cod Miso', 'Yellowtail Jalapeño'],
    publishedAt: new Date().toISOString(),
    author: 'Lee'
  }
];

export function getAllReviews(): Review[] {
  return reviews.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find(review => review.slug === slug);
}
