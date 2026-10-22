import type { ImageSourcePropType } from 'react-native';

export type RootStackParamList = {
  DrawerNavigator: undefined;
  Details: {
    title: string;
    description: string;
    headerImage: ImageSourcePropType | string;
    movie: number | string | { uri: string };
    category?: string;
    genres?: string[];
    releaseYear?: number;
    rating?: number;
    ratingCount?: number;
    contentRating?: string;
    duration?: number;
  };
  Player: {
    movie: number | string | { uri: string };
    headerImage: ImageSourcePropType | string;
  };
};

export type DrawerParamList = {
  Home: undefined;
  Explore: undefined;
  TV: undefined;
  Settings: undefined;
};
