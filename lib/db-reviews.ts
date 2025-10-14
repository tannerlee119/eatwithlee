import { prisma } from './prisma';
import { Review } from './types';

// Helper to convert DB Review to App Review format
function dbToReview(dbReview: any): Review {
  // Parse images and handle backward compatibility
  const parsedImages = JSON.parse(dbReview.images || '[]');
  const images = parsedImages.map((img: any) => {
    // If it's already an object with url and caption, use it
    if (typeof img === 'object' && img.url) {
      return { url: img.url, caption: img.caption || '' };
    }
    // If it's a string (old format), convert to new format
    return { url: img, caption: '' };
  });

  return {
    id: dbReview.id,
    contentType: dbReview.contentType || 'review',
    isDraft: dbReview.isDraft || false,
    title: dbReview.title,
    restaurantName: dbReview.restaurantName,
    slug: dbReview.slug,
    excerpt: dbReview.excerpt,
    content: dbReview.content,
    rating: dbReview.rating,
    images,
    coverImage: dbReview.coverImage,
    location: {
      address: dbReview.address,
      lat: dbReview.lat,
      lng: dbReview.lng,
    },
    locationTag: dbReview.locationTag || '',
    website: dbReview.website || '',
    instagram: dbReview.instagram || '',
    priceRange: dbReview.priceRange || 2,
    tags: {
      cuisines: JSON.parse(dbReview.cuisines || '[]'),
      vibes: JSON.parse(dbReview.vibes || '[]'),
      foodTypes: JSON.parse(dbReview.foodTypes || '[]'),
    },
    favoriteDishes: JSON.parse(dbReview.favoriteDishes || '[]'),
    publishedAt: dbReview.publishedAt.toISOString(),
    author: dbReview.author,
  };
}

// Helper to convert App Review to DB format
function reviewToDb(review: Partial<Review>) {
  return {
    contentType: review.contentType || 'review',
    isDraft: review.isDraft !== undefined ? review.isDraft : false,
    title: review.title,
    restaurantName: review.restaurantName,
    slug: review.slug,
    excerpt: review.excerpt,
    content: review.content,
    rating: review.rating,
    images: JSON.stringify(review.images || []),
    coverImage: review.coverImage,
    address: review.location?.address,
    lat: review.location?.lat,
    lng: review.location?.lng,
    locationTag: review.locationTag || '',
    website: review.website || '',
    instagram: review.instagram || '',
    priceRange: review.priceRange || 2,
    cuisines: JSON.stringify(review.tags?.cuisines || []),
    vibes: JSON.stringify(review.tags?.vibes || []),
    foodTypes: JSON.stringify(review.tags?.foodTypes || []),
    favoriteDishes: JSON.stringify(review.favoriteDishes || []),
    author: review.author || 'Lee',
  };
}

export async function getAllReviews(): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
  });
  return reviews.map(dbToReview);
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const review = await prisma.review.findUnique({
    where: { slug },
  });
  return review ? dbToReview(review) : null;
}

export async function createReview(review: Partial<Review>): Promise<Review> {
  const dbReview = await prisma.review.create({
    data: reviewToDb(review) as any,
  });
  return dbToReview(dbReview);
}

export async function updateReview(id: string, review: Partial<Review>): Promise<Review> {
  const dbReview = await prisma.review.update({
    where: { id },
    data: reviewToDb(review) as any,
  });
  return dbToReview(dbReview);
}

export async function deleteReview(id: string): Promise<void> {
  await prisma.review.delete({
    where: { id },
  });
}
