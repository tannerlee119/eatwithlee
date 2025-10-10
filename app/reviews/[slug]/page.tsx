import { getReviewBySlug, getAllReviews } from '@/lib/db-reviews';
import { notFound } from 'next/navigation';
import AnimatedReviewPage from '@/components/AnimatedReviewPage';

export async function generateStaticParams() {
  const reviews = await getAllReviews();
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  return <AnimatedReviewPage review={review} />;
}
