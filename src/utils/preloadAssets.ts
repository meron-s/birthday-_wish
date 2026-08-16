/** Preload images and audio in the background while the intro plays. */
export function preloadAssets(urls: string[]): void {
  for (const url of urls) {
    if (url.match(/\.(png|jpe?g|webp|gif|avif)(\?|$)/i)) {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      continue;
    }

    if (url.match(/\.(mp3|ogg|wav|m4a)(\?|$)/i)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "audio";
      link.href = url;
      document.head.appendChild(link);
    }
  }
}
