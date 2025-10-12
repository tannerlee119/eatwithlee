import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, createReview } from '@/lib/db-reviews';
import { Review } from '@/lib/types';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate slug from restaurant name
    const slug = body.restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Convert admin form data to Review format
    const reviewData: Partial<Review> = {
      contentType: body.contentType,
      isDraft: body.isDraft,
      title: body.title,
      restaurantName: body.restaurantName,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      rating: body.rating,
      images: body.images,
      coverImage: body.coverImage,
      location: body.location,
      locationTag: body.locationTag,
      tags: body.tags,
      favoriteDishes: body.favoriteDishes,
      author: body.author || 'Tanner Lee',
    };

    const review = await createReview(reviewData);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
