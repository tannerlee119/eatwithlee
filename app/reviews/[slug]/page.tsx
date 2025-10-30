import { getReviewBySlug, getAllReviews } from '@/lib/db-reviews';
import { notFound } from 'next/navigation';
import AnimatedReviewPage from '@/components/AnimatedReviewPage';

export const revalidate = 0;

export async function generateStaticParams() {
  const reviews = await getAllReviews();
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  // Block access to drafts and non-existent reviews
  if (!review || review.isDraft) {
    notFound();
  }

  return <AnimatedReviewPage review={review} />;
}
