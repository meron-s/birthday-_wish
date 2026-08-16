import { useMusic } from "../context/MusicContext";
import { motion } from "framer-motion";

export default function MusicControl() {
  const { playing, toggle } = useMusic();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
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
