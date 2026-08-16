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

  /** Gallery photos (shown in the photo section) */
  photos: [
    "/photos/photo1.png",
    "/photos/photo2.png",
    "/photos/photo3.png",
    "/photos/photo4.png",
  ],

  /**
   * Photos used to build the interactive heart collage.
   * Cycles through your photos to fill all heart slots.
   */
  heartPhotos: [
    "/photos/photo1.png",
    "/photos/photo2.png",
    "/photos/photo3.png",
    "/photos/photo4.png",
  ],

  /**
   * Optional background music — drop your song at this path.
   * Leave empty string to hide the music button.
   */
  musicSrc: "",
} as const;

export type BirthdayConfig = typeof birthday;
