import { motion } from "framer-motion";
import { birthday } from "../data/birthday";
import ParticleBackground from "./ParticleBackground";

interface BirthdayMessageProps {
  onContinue: () => void;
}

export default function BirthdayMessage({ onContinue }: BirthdayMessageProps) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6"
      onClick={onContinue}
      onKeyDown={(e) => e.key === "Enter" && onContinue()}
      role="button"
      tabIndex={0}
    >
      <ParticleBackground />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-center text-[clamp(1.4rem,5.5vw,2rem)] font-semibold tracking-wide text-soft-white"
        >
          {birthday.greeting}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glow-pink-box w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-7 backdrop-blur-sm"
        >
          <div className="mb-3 text-neon-pink">♥</div>
          <p className="font-display text-center text-[clamp(1.05rem,4vw,1.35rem)] leading-relaxed text-white/90">
            {birthday.mainMessage}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-xs tracking-widest text-white/40 uppercase"
        >
          tap to continue
        </motion.p>
      </div>
    </div>
  );
}
