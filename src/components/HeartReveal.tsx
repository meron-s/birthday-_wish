import { motion } from "framer-motion";

interface HeartRevealProps {
  onComplete: () => void;
}

/** Standalone heart zoom transition — used if intro is split from matrix */
export default function HeartReveal({ onComplete }: HeartRevealProps) {
  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center bg-dark-navy"
      initial={{ scale: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="neon-heart text-[clamp(6rem,28vw,12rem)] text-neon-pink"
      >
        ♥
      </motion.div>
    </motion.div>
  );
}
