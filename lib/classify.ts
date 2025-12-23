import type { Review } from '@/lib/types';

function normalizeTags(tags: string[] | undefined) {
  return (tags || []).map((t) => t.toLowerCase().trim());
}

/**
 * Heuristic classifier: treats a review as a "bar" if any vibe/foodType/cuisine
 * contains common bar-like keywords.
 */
export function isBarReview(review: Pick<Review, 'tags'>) {
  const haystack = [
    ...normalizeTags(review.tags?.vibes),
    ...normalizeTags(review.tags?.foodTypes),
    ...normalizeTags(review.tags?.cuisines),
  ].join(' • ');

  const keywords = [
    'bar',
    'wine bar',
    'cocktail',
    'cocktails',
    'brewery',
    'taproom',
    'pub',
    'tavern',
    'speakeasy',
    'lounge',
    'mezcal',
    'tequila bar',
  ];

  return keywords.some((k) => haystack.includes(k));
}


