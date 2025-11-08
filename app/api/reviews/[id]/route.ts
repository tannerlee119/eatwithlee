import { NextRequest, NextResponse } from 'next/server';
import { updateReview, deleteReview } from '@/lib/db-reviews';
import { Review } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('PATCH /api/reviews/[id] - body.tags:', body.tags);
    console.log('PATCH /api/reviews/[id] - body.coverImageCrop:', body.coverImageCrop);

    // Generate slug from restaurant name if it changed
    const slug = body.restaurantName
      ? body.restaurantName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : undefined;

    // Convert admin form data to Review format
    const reviewData: Partial<Review> = {
      contentType: body.contentType,
      isDraft: body.isDraft,
      title: body.title,
      restaurantName: body.restaurantName,
      slug: slug || body.slug,
      excerpt: body.excerpt,
      content: body.content,
      rating: body.rating,
      images: body.images,
      coverImage: body.coverImage,
      coverImageCrop: body.coverImageCrop,
      location: body.location,
      locationTag: body.locationTag,
      website: body.website || '',
      instagram: body.instagram || '',
      priceRange: body.priceRange || 2,
      tags: body.tags,
      favoriteDishes: body.favoriteDishes,
      author: body.author || 'Tanner Lee',
      publishedAt: body.publishedAt,
    };

    console.log('PATCH /api/reviews/[id] - reviewData.tags:', reviewData.tags);

    const review = await updateReview(id, reviewData);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteReview(id);
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
