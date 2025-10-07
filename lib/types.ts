export interface Review {
  id: string;
  title: string;
  restaurantName: string;
  slug: string;
  excerpt: string;
  content: string;
  rating: number;
  images: string[];
  coverImage: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  tags: {
    cuisines: string[];
    vibes: string[];
    foodTypes: string[];
  };
  favoriteDishes: string[];
  publishedAt: string;
  author: string;
}
