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
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  locationTag: string;
  tags: {
    cuisines: string[];
    vibes: string[];
    foodTypes: string[];
  };
  favoriteDishes: string[];
  publishedAt: string;
  author: string;
}
