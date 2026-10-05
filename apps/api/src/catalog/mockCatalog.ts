import type { CatalogItem } from "./CatalogProvider";

export const mockCatalog: CatalogItem[] = [
  {
    id: "neon-rain",
    title: "Neon Rain",
    description:
      "A dark cinematic science-fiction story set in a rain-soaked future city.",
    durationMinutes: 82,
    genres: ["sci-fi", "thriller"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },
  {
    id: "the-last-signal",
    title: "The Last Signal",
    description:
      "A cinematic science-fiction mystery about a final transmission from deep space.",
    durationMinutes: 88,
    genres: ["sci-fi", "drama"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },
  {
    id: "summer-light",
    title: "Summer Light",
    description:
      "A warm coming-of-age drama about friendship and memories.",
    durationMinutes: 95,
    genres: ["drama"],
    mood: ["romantic"],
    cinematic: true,
  },
  {
    id: "laughing-stars",
    title: "Laughing Stars",
    description:
      "A light comedy about two filmmakers trying to make their first movie.",
    durationMinutes: 76,
    genres: ["comedy"],
    mood: ["funny"],
    cinematic: true,
  },
];