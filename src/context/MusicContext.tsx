import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AmbientMusic } from "../utils/ambientMusic";

interface MusicContextValue {
  playing: boolean;
  toggle: () => void;
  start: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

interface MusicProviderProps {
  src?: string;
  useAmbient?: boolean;
  volume?: number;
  children: ReactNode;
}

export function MusicProvider({
  src = "",
  useAmbient = true,
  volume = 0.45,
  children,
}: MusicProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<AmbientMusic | null>(null);
  const modeRef = useRef<"file" | "ambient" | null>(null);
  const unlockedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const startFile = useCallback(async () => {
    if (!src) return false;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
    }

    try {
      await audioRef.current.play();
      modeRef.current = "file";
      setPlaying(true);
      return true;
    } catch {
      return false;
    }
  }, [src, volume]);

  const startAmbient = useCallback(async () => {
    if (!useAmbient) return false;

    if (!ambientRef.current) {
      ambientRef.current = new AmbientMusic();
    }

    try {
      await ambientRef.current.start(volume * 0.75);
      modeRef.current = "ambient";
      setPlaying(true);
      return true;
    } catch {
      return false;
    }
  }, [useAmbient, volume]);

  const start = useCallback(async () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;

    const fileOk = src ? await startFile() : false;
    if (!fileOk) {
      await startAmbient();
    }
  }, [src, startFile, startAmbient]);

  const toggle = useCallback(async () => {
    if (playing) {
      if (modeRef.current === "file") {
        audioRef.current?.pause();
      } else {
        ambientRef.current?.stop();
        ambientRef.current = null;
      }
      modeRef.current = null;
      setPlaying(false);
      unlockedRef.current = false;
      return;
    }

    unlockedRef.current = true;
    const fileOk = src ? await startFile() : false;
    if (!fileOk) {
      await startAmbient();
    }
  }, [playing, src, startFile, startAmbient]);

  useEffect(() => {
    if (!src && !useAmbient) return;

    const unlock = () => void start();

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      audioRef.current?.pause();
      ambientRef.current?.stop();
    };
  }, [src, useAmbient, start]);

  return (
    <MusicContext.Provider value={{ playing, toggle, start }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    return {
      playing: false,
      toggle: () => {},
      start: () => {},
    };
  }
  return ctx;
}
