/**
 * Navigation type definitions for the Vega app.
 *
 * Details and Player params mirror @multi-tv/shared-ui's RootStackParamList
 * so that DetailsScreen and PlayerScreen (imported from shared-ui) receive
 * the correct route params.
 *
 * Sprint 3 fix: the previous definition used:
 *   Details: { itemId: string }   ← wrong, caused runtime mismatch
 *   Player:  { videoId: string }  ← wrong
 *
 * Vega uses "Main" (not "DrawerNavigator") as its root screen name because
 * it wraps VegaDrawerNavigator rather than the shared-ui DrawerNavigator.
 */

export type RootStackParamList = {
  /** Vega-specific root screen wrapping VegaDrawerNavigator. */
  Main: undefined;
  /**
   * Detail screen — params match shared-ui DetailsScreen expectations.
   * All fields except title/description/headerImage/movie are optional.
   */
  Details: {
    title: string;
    description: string;
    headerImage: string;
    movie: string;
    category?: string;
    genres?: string[];
    releaseYear?: number;
    rating?: number;
    ratingCount?: number;
    contentRating?: string;
    /** Duration in seconds (DetailsScreen formats to "Xm Ys"). */
    duration?: number;
  };
  /** Player screen — params match shared-ui PlayerScreen expectations. */
  Player: {
    movie: string;
    headerImage: string;
  };
};

export type DrawerParamList = {
  Home: undefined;
  Explore: undefined;
  TV: undefined;
  Settings: undefined;
};
