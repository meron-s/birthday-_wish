/**
 * Edit this file to personalize the entire birthday experience.
 * No need to touch animation components.
 */
export const birthday = {
  name: "Meklit",

  /** Numbers shown during the matrix intro before "BIRTHDAY" */
  countSequence: ["1", "2", "3"],

  introText: "BIRTHDAY",

  greeting: "Happy Birthday, Meklit 🤍",

  mainMessage:
    "Happy birthday to someone who turns ordinary moments into something worth remembering.",

  secondMessage: "Life is a little brighter with you in it.",

  finalMessage: "Here's to you — today and always. 🤍",

  /** Gallery photos — WebP for fast loading (run `npm run optimize:photos` after changing PNGs) */
  photos: [
    "/photos/photo1.webp",
    "/photos/photo2.webp",
    "/photos/photo3.webp",
    "/photos/photo4.webp",
  ],

  /** Photos used to build the interactive heart collage */
  heartPhotos: [
    "/photos/photo1.webp",
    "/photos/photo2.webp",
    "/photos/photo3.webp",
    "/photos/photo4.webp",
  ],

  /**
   * Optional MP3 — place your song at public/music/birthday.mp3
   * Leave empty to use the built-in soft ambient background.
   */
  musicSrc: "",

  /** Built-in ambient pad (used when musicSrc is empty) */
  useAmbientMusic: true,

  /** Volume 0–1 */
  musicVolume: 0.45,
} as const;

export type BirthdayConfig = typeof birthday;
