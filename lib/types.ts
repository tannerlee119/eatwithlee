export type ContentType = 'review' | 'list';

export interface ImageWithCaption {
  url: string;
  caption: string;
}

export interface Review {
  id: string;
  contentType: ContentType;
  isDraft: boolean;
  title: string;
  restaurantName: string;
  slug: string;
  excerpt: string;
  content: string;
  rating: number;
  images: ImageWithCaption[];
  coverImage: string;
  coverImageCrop?: {
    x: number;
    y: number;
    zoom: number;
  };
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  locationTag: string;
  website: string;
  instagram: string;
  yelp: string;
  priceRange: number;
  tags: {
    cuisines: string[];
    vibes: string[];
    foodTypes: string[];
  };
  favoriteDishes: string[];
  leastFavoriteDishes: string[];
  publishedAt: string;
  author: string;
}
