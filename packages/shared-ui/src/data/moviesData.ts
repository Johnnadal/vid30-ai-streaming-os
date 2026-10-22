declare const require: (path: string) => number | string | { uri: string };

type LocalAssetSource = number | string | { uri: string };

// Simplified card data for UI components
export type CardData = {
  id: string | number;
  title: string;
  description: string;
  headerImage: LocalAssetSource;
  movie: LocalAssetSource;
  duration?: number;
  category?: string;
  genres?: string[];
  releaseYear?: number;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  trending?: boolean;
};

const CATALOG_URL = 'https://giolaq.github.io/scrap-tv-feed/catalog.json';

export const moviesData: CardData[] = [
  {
    id: 'vid30-ai-directors-commercial',
    title: 'The AI Directors · Commercial FUT',
    description: 'A cutting-edge commercial exploring the future of AI in creative direction.',
    headerImage: require('../../../../images/film1.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-ai-directors-commercial.mp4'),
    duration: 15,
    category: 'Commercial',
    genres: ['commercial', 'sci-fi'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'G',
    trending: true,
  },
  {
    id: 'vid30-adidas-creative',
    title: 'Adidas · Creative Direction',
    description: 'A bold creative campaign for Adidas with high-energy visuals and dynamic cinematography.',
    headerImage: require('../../../../images/film2.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-adidas-creative.mp4'),
    duration: 33,
    category: 'Commercial',
    genres: ['commercial', 'sports'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'G',
    trending: true,
  },
  {
    id: 'vid30-creative-visual-storytelling',
    title: 'Creative Project: Visual Storytelling',
    description: 'An experimental visual storytelling piece blending art, narrative, and cinematography.',
    headerImage: require('../../../../images/film3.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-creative-visual-storytelling.mp4'),
    duration: 522,
    category: 'Experimental',
    genres: ['experimental', 'art'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'PG',
    trending: true,
  },
  {
    id: 'vid30-les-annees-retrouvees',
    title: 'Les années retrouvées',
    description: 'A personal documentary about memories, family history, and the stories that shaped the present.',
    headerImage: require('../../../../images/film4.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-les-annees-retrouvees.mp4'),
    duration: 860,
    category: 'Documentary',
    genres: ['documentary', 'history'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'PG',
    trending: true,
  },
  {
    id: 'vid30-histoire-patrimoine',
    title: 'Histoire & Patrimoine: La Grande Guerre',
    description: 'A historical documentary exploring cultural heritage and archives from World War I.',
    headerImage: require('../../../../images/film5.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-histoire-patrimoine.mp4'),
    duration: 415,
    category: 'Documentary',
    genres: ['documentary', 'history'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'PG-13',
    trending: true,
  },
  {
    id: 'vid30-animation-short',
    title: "Un court métrage d'animation",
    description: 'A charming animated short with hand-drawn animation and whimsical characters.',
    headerImage: require('../../../../images/film6.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-animation-short.mp4'),
    duration: 180,
    category: 'Animation',
    genres: ['animation', 'family'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'G',
    trending: true,
  },
  {
    id: 'vid30-arriere-grand-mere',
    title: 'Arrière-grand-mère: A Life Remembered',
    description: 'An intimate documentary tracing the life of a remarkable woman born in 1926.',
    headerImage: require('../../../../images/film7.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-arriere-grand-mere.mp4'),
    duration: 1080,
    category: 'Documentary',
    genres: ['documentary', 'biography'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'PG',
    trending: true,
  },
  {
    id: 'vid30-photojournalism-tribute',
    title: 'A Tribute to Photojournalism',
    description: 'A documentary honoring photojournalists who risked their lives to document history.',
    headerImage: require('../../../../images/film8.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-photojournalism-tribute.mp4'),
    duration: 1335,
    category: 'Documentary',
    genres: ['documentary', 'biography'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'PG-13',
    trending: true,
  },
  {
    id: 'vid30-archives-paris-1900',
    title: 'Archives Restoration: Paris 1900',
    description: 'A behind-the-scenes look at restoring historic Paris archives from the early 1900s.',
    headerImage: require('../../../../images/film9.jpg'),
    movie: require('../../../../apps/web/public/videos/vid30-archives-paris-1900.mp4'),
    duration: 330,
    category: 'Documentary',
    genres: ['documentary', 'history'],
    releaseYear: 2026,
    rating: 0,
    ratingCount: 0,
    contentRating: 'G',
    trending: true,
  },
];

export const fetchMoviesData = async (): Promise<CardData[]> => moviesData;
