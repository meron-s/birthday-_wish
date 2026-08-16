import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MusicControlProps {
  src: string;
}

export default function MusicControl({ src }: MusicControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    if (!src) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing, src]);

  if (!src) return null;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:border-neon-pink/40"
      aria-label={playing ? "Pause music" : "Play music"}
    >
      <motion.span
        animate={playing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={playing ? { repeat: Infinity, duration: 1.2 } : {}}
        className="text-lg"
      >
        {playing ? "🔊" : "🎵"}
      </motion.span>
    </motion.button>
  );
}
