import type { CatalogItem } from "./CatalogProvider";

/**
 * Demo catalog — 24 films.
 * contentRating and familySafe are demo classifications, not official certifications.
 * familySafe = true iff contentRating ∈ ["G", "PG", "PG-13"].
 * origin = "catalog" for standard films (stored in this demo).
 */
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "R",
    familySafe: false,
    origin: "catalog",
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
    contentRating: "R",
    familySafe: false,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "R",
    familySafe: false,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "R",
    familySafe: false,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "G",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "PG-13",
    familySafe: true,
    origin: "catalog",
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
    contentRating: "R",
    familySafe: false,
    origin: "catalog",
  },

  // --- VID30 ORIGINALS (Founder Films) — Example format ──────────────────
  // These are fictional examples showing the expected structure for founder-created films.
  // Videos referenced are not committed to the repo; they should be served locally during dev.
  // Example paths:
  //   - Local dev: file:///videos/vid30-originals/echoes-of-creation.mp4
  //   - Dev server: http://localhost:5173/videos/vid30-originals/echoes-of-creation.mp4
  {
    id: "vid30-echoes-of-creation",
    title: "Echoes of Creation",
    description:
      "[DEMO] A behind-the-scenes documentary about how Vid30 was imagined and built. Features interviews with the founding team exploring AI-driven discovery, the philosophy behind recommendation systems, and dreams of a better streaming future.",
    durationMinutes: 52,
    genres: ["documentary", "tech"],
    mood: ["inspiring", "thoughtful"],
    cinematic: true,
    contentRating: "G",
    familySafe: true,
    origin: "founder",
  },
  {
    id: "vid30-pixels-and-dreams",
    title: "Pixels and Dreams",
    description:
      "[DEMO] A short film exploring the intersection of technology and storytelling. Follows a filmmaker debugging code at midnight while dreaming of audiences discovering their work through AI.",
    durationMinutes: 19,
    genres: ["drama", "sci-fi"],
    mood: ["mysterious", "hopeful"],
    cinematic: true,
    contentRating: "PG",
    familySafe: true,
    origin: "founder",
  },
  {
    id: "vid30-algorithms-of-wonder",
    title: "Algorithms of Wonder",
    description:
      "[DEMO] An experimental essay film on how algorithms shape our understanding of beauty, relevance, and discovery in the digital age. Poetic, contemplative, and wonderfully weird.",
    durationMinutes: 35,
    genres: ["experimental", "art"],
    mood: ["mysterious", "dark"],
    cinematic: true,
    contentRating: "PG-13",
    familySafe: true,
    origin: "founder",
  },
];
