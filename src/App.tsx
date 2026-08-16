import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { birthday } from "./data/birthday";
import MatrixIntro from "./components/MatrixIntro";
import BirthdayMessage from "./components/BirthdayMessage";
import PhotoGallery from "./components/PhotoGallery";
import PhotoHeart from "./components/PhotoHeart";
import MusicControl from "./components/MusicControl";
import SceneTransition from "./components/SceneTransition";

type Scene = "intro" | "message" | "gallery" | "heart";

export default function App() {
  const [scene, setScene] = useState<Scene>("intro");

  const goToMessage = useCallback(() => setScene("message"), []);
  const goToGallery = useCallback(() => setScene("gallery"), []);
  const goToHeart = useCallback(() => setScene("heart"), []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-dark-navy">
      <MusicControl src={birthday.musicSrc} />

      <AnimatePresence mode="wait">
        {scene === "intro" && (
          <SceneTransition sceneKey="intro">
            <MatrixIntro onComplete={goToMessage} />
          </SceneTransition>
        )}

        {scene === "message" && (
          <SceneTransition sceneKey="message">
            <BirthdayMessage onContinue={goToGallery} />
          </SceneTransition>
        )}

        {scene === "gallery" && (
          <SceneTransition sceneKey="gallery">
            <PhotoGallery onContinue={goToHeart} />
          </SceneTransition>
        )}

        {scene === "heart" && (
          <SceneTransition sceneKey="heart">
            <PhotoHeart />
          </SceneTransition>
        )}
      </AnimatePresence>
    </div>
  );
}
