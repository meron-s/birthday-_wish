import { motion } from "framer-motion";
import { birthday } from "../data/birthday";
import ParticleBackground from "./ParticleBackground";

interface PhotoGalleryProps {
  onContinue: () => void;
}

export default function PhotoGallery({ onContinue }: PhotoGalleryProps) {
  const photos = birthday.photos;

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden overflow-y-auto px-5 py-16"
      onClick={onContinue}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onContinue()}
    >
      <ParticleBackground density={0.00006} />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8">
        <div className="grid w-full grid-cols-2 gap-4">
          {photos.slice(0, 2).map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 40, rotate: i === 0 ? -3 : 3 }}
              animate={{ opacity: 1, y: 0, rotate: i === 0 ? -2 : 2 }}
              transition={{
                duration: 0.9,
                delay: 0.4 + i * 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              whileTap={{ scale: 0.98 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-white/5 glow-pink-box"
            >
              <motion.img
                src={src}
                alt={`Memory ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>

        {photos.length > 2 && (
          <div className="grid w-full grid-cols-2 gap-4">
            {photos.slice(2).map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 40, rotate: i === 0 ? 2 : -2 }}
                animate={{ opacity: 1, y: 0, rotate: i === 0 ? 1 : -1 }}
                transition={{
                  duration: 0.9,
                  delay: 1.1 + i * 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-white/5 glow-pink-box"
              >
                <motion.img
                  src={src}
                  alt={`Memory ${i + 3}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          className="glow-pink-box w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-6 backdrop-blur-sm"
        >
          <p className="font-display text-center text-[clamp(1rem,3.8vw,1.25rem)] leading-relaxed text-white/85">
            {birthday.secondMessage}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="text-xs tracking-widest text-white/40 uppercase"
        >
          tap to continue
        </motion.p>
      </div>
    </div>
  );
}
