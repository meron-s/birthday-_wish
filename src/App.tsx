import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { birthday } from "./data/birthday";
import { MusicProvider } from "./context/MusicContext";
import MatrixIntro from "./components/MatrixIntro";
import MusicControl from "./components/MusicControl";
import SceneTransition from "./components/SceneTransition";
import { preloadAssets } from "./utils/preloadAssets";

const BirthdayMessage = lazy(() => import("./components/BirthdayMessage"));
const PhotoGallery = lazy(() => import("./components/PhotoGallery"));
const PhotoHeart = lazy(() => import("./components/PhotoHeart"));

type Scene = "intro" | "message" | "gallery" | "heart";

function SceneFallback() {
  return <div className="absolute inset-0 bg-dark-navy" aria-hidden />;
}

export default function App() {
  const [scene, setScene] = useState<Scene>("intro");

  const goToMessage = useCallback(() => setScene("message"), []);
  const goToGallery = useCallback(() => setScene("gallery"), []);
  const goToHeart = useCallback(() => setScene("heart"), []);

  useEffect(() => {
    preloadAssets([...birthday.photos, birthday.musicSrc].filter(Boolean));
  }, []);

  return (
    <MusicProvider
      src={birthday.musicSrc}
      useAmbient={birthday.useAmbientMusic}
      volume={birthday.musicVolume}
    >
      <div className="relative h-[100dvh] w-full overflow-hidden bg-dark-navy">
        {(birthday.musicSrc || birthday.useAmbientMusic) && <MusicControl />}

        <AnimatePresence mode="wait">
          {scene === "intro" && (
            <SceneTransition sceneKey="intro">
              <MatrixIntro onComplete={goToMessage} />
            </SceneTransition>
          )}

          {scene === "message" && (
            <SceneTransition sceneKey="message">
              <Suspense fallback={<SceneFallback />}>
                <BirthdayMessage onContinue={goToGallery} />
              </Suspense>
            </SceneTransition>
          )}

          {scene === "gallery" && (
            <SceneTransition sceneKey="gallery">
              <Suspense fallback={<SceneFallback />}>
                <PhotoGallery onContinue={goToHeart} />
              </Suspense>
            </SceneTransition>
          )}

          {scene === "heart" && (
            <SceneTransition sceneKey="heart">
              <Suspense fallback={<SceneFallback />}>
                <PhotoHeart />
              </Suspense>
            </SceneTransition>
          )}
        </AnimatePresence>
      </div>
    </MusicProvider>
  );
}
