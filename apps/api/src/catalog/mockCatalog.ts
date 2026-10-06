import type { CatalogItem } from "./CatalogProvider";

export const mockCatalog: CatalogItem[] = [
  // --- DARK / CINEMATIC ---
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
    id: "obsidian-city",
    title: "Obsidian City",
    description:
      "A noir detective thriller set in a crumbling megalopolis ruled by corrupt corporations.",
    durationMinutes: 105,
    genres: ["thriller", "noir"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },
  {
    id: "hollow-echo",
    title: "Hollow Echo",
    description:
      "A psychological horror story about a sound engineer who discovers a frequency that reveals hidden memories.",
    durationMinutes: 78,
    genres: ["horror", "thriller"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },
  {
    id: "the-iron-meridian",
    title: "The Iron Meridian",
    description:
      "An epic dystopian drama following three strangers navigating a world divided by an invisible wall.",
    durationMinutes: 132,
    genres: ["sci-fi", "drama"],
    mood: ["dark"],
    cinematic: true,
  },
  {
    id: "pale-embers",
    title: "Pale Embers",
    description:
      "A bleak and beautiful post-apocalyptic road movie about a father searching for his daughter.",
    durationMinutes: 98,
    genres: ["drama"],
    mood: ["dark"],
    cinematic: true,
  },

  // --- MYSTERIOUS ---
  {
    id: "the-cartographer",
    title: "The Cartographer",
    description:
      "A mysterious thriller in which a map-maker discovers that every city she charts disappears within a week.",
    durationMinutes: 91,
    genres: ["thriller", "mystery"],
    mood: ["mysterious"],
    cinematic: true,
  },
  {
    id: "deep-water-station",
    title: "Deep Water Station",
    description:
      "Scientists at an underwater research base begin experiencing shared hallucinations after a strange signal is detected.",
    durationMinutes: 87,
    genres: ["sci-fi", "horror"],
    mood: ["mysterious", "dark"],
    cinematic: true,
  },
  {
    id: "the-amber-room",
    title: "The Amber Room",
    description:
      "A historical mystery following an art historian obsessed with finding a legendary chamber lost during WWII.",
    durationMinutes: 112,
    genres: ["mystery", "drama"],
    mood: ["mysterious"],
    cinematic: true,
  },

  // --- FUNNY / COMEDY ---
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
  {
    id: "operation-croissant",
    title: "Operation Croissant",
    description:
      "A French pastry chef accidentally becomes a spy and must save a G7 summit using only baking skills.",
    durationMinutes: 95,
    genres: ["comedy", "action"],
    mood: ["funny"],
    cinematic: false,
  },
  {
    id: "reboot-day",
    title: "Reboot Day",
    description:
      "Every morning a hapless IT consultant wakes up to find the world has been factory-reset.",
    durationMinutes: 83,
    genres: ["comedy", "sci-fi"],
    mood: ["funny"],
    cinematic: false,
  },
  {
    id: "three-cats-one-job",
    title: "Three Cats, One Job",
    description:
      "An absurdist mockumentary following three office cats who are secretly running a multinational company.",
    durationMinutes: 71,
    genres: ["comedy"],
    mood: ["funny"],
    cinematic: false,
  },
  {
    id: "the-understudies",
    title: "The Understudies",
    description:
      "A Broadway comedy about replacement actors who must perform a play they have never rehearsed.",
    durationMinutes: 89,
    genres: ["comedy", "drama"],
    mood: ["funny", "romantic"],
    cinematic: true,
  },

  // --- ROMANTIC ---
  {
    id: "summer-light",
    title: "Summer Light",
    description:
      "A warm coming-of-age drama about friendship and memories shared during a last summer on the coast.",
    durationMinutes: 95,
    genres: ["drama"],
    mood: ["romantic"],
    cinematic: true,
  },
  {
    id: "the-violet-hour",
    title: "The Violet Hour",
    description:
      "Two strangers meet on the same park bench every evening at dusk without ever knowing each other's name.",
    durationMinutes: 102,
    genres: ["romance", "drama"],
    mood: ["romantic"],
    cinematic: true,
  },
  {
    id: "letters-from-lisbon",
    title: "Letters from Lisbon",
    description:
      "A journalist discovers a box of love letters written in 1943 and traces them to their unlikely author.",
    durationMinutes: 118,
    genres: ["romance", "drama"],
    mood: ["romantic"],
    cinematic: true,
  },
  {
    id: "between-two-tides",
    title: "Between Two Tides",
    description:
      "A marine biologist and a lighthouse keeper fall in love over one stormy winter on an isolated island.",
    durationMinutes: 86,
    genres: ["romance", "drama"],
    mood: ["romantic"],
    cinematic: true,
  },

  // --- ACTION / THRILLER ---
  {
    id: "red-frequency",
    title: "Red Frequency",
    description:
      "A retired signals analyst is pulled back into a world of espionage when a dormant code begins transmitting again.",
    durationMinutes: 109,
    genres: ["thriller", "action"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },
  {
    id: "fracture-line",
    title: "Fracture Line",
    description:
      "An earthquake geologist uncovers evidence that the next big one is not natural — it was engineered.",
    durationMinutes: 97,
    genres: ["action", "thriller"],
    mood: ["dark"],
    cinematic: true,
  },
  {
    id: "zero-approach",
    title: "Zero Approach",
    description:
      "A commercial pilot lands a plane without instruments in a whiteout blizzard and discovers the airport does not exist on any map.",
    durationMinutes: 84,
    genres: ["thriller"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },

  // --- SCI-FI ---
  {
    id: "borrowed-orbit",
    title: "Borrowed Orbit",
    description:
      "The lone crew member of a generation ship discovers she may be the only real person on board.",
    durationMinutes: 94,
    genres: ["sci-fi", "drama"],
    mood: ["mysterious", "dark"],
    cinematic: true,
  },
  {
    id: "cascade-protocol",
    title: "Cascade Protocol",
    description:
      "A quantum network engineer must prevent a chain reaction that would erase all digital memory on Earth.",
    durationMinutes: 101,
    genres: ["sci-fi", "thriller"],
    mood: ["dark"],
    cinematic: true,
  },
  {
    id: "the-soft-machine",
    title: "The Soft Machine",
    description:
      "In a near future where dreams are monetised, a copyright enforcement agent begins dreaming someone else's life.",
    durationMinutes: 116,
    genres: ["sci-fi", "drama"],
    mood: ["dark", "mysterious"],
    cinematic: true,
  },
];
