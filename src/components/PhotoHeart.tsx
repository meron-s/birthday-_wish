import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { birthday } from "../data/birthday";
import ParticleBackground from "./ParticleBackground";
import {
  computeHeartLayout,
  computePhotoSize,
  getHeartSlotCount,
  randomScatterPosition,
  type HeartPosition,
} from "../utils/heartLayout";

type PhotoPhase =
  | "empty"
  | "appear"
  | "scatter"
  | "assemble"
  | "complete"
  | "pulse";

interface PhotoItem {
  id: number;
  src: string;
  scatter: HeartPosition;
  target: HeartPosition;
  delay: number;
  floatOffset: number;
  idleRotation: number;
}

interface PhotoHeartProps {
  onComplete?: () => void;
}

export default function PhotoHeart({ onComplete }: PhotoHeartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<PhotoPhase>("empty");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [visibleCount, setVisibleCount] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [floatTick, setFloatTick] = useState(0);

  const slotCount = getHeartSlotCount();
  const photoSize = useMemo(
    () => computePhotoSize(dimensions.width, dimensions.height),
    [dimensions],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      setDimensions({ width: node.clientWidth, height: node.clientHeight });
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const photos: PhotoItem[] = useMemo(() => {
    if (dimensions.width === 0) return [];

    const targets = computeHeartLayout(
      dimensions.width,
      dimensions.height,
      photoSize,
    );
    const heartPhotos = birthday.heartPhotos;

    return targets.map((target, i) => ({
      id: i,
      src: heartPhotos[i % heartPhotos.length],
      scatter: randomScatterPosition(dimensions.width, dimensions.height),
      target,
      delay: i * 0.07,
      floatOffset: Math.random() * Math.PI * 2,
      idleRotation: (Math.random() - 0.5) * 20,
    }));
  }, [dimensions, photoSize]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("appear"), 800));

    timers.push(setTimeout(() => setPhase("scatter"), 2800));
    timers.push(setTimeout(() => setPhase("assemble"), 4500));
    timers.push(setTimeout(() => setPhase("complete"), 4500 + slotCount * 90 + 1400));
    timers.push(setTimeout(() => setPhase("pulse"), 4500 + slotCount * 90 + 2200));
    timers.push(
      setTimeout(() => {
        setShowFinalMessage(true);
        onComplete?.();
      }, 4500 + slotCount * 90 + 4000),
    );

    return () => timers.forEach(clearTimeout);
  }, [slotCount, onComplete]);

  useEffect(() => {
    if (phase !== "appear" && phase !== "scatter") return;

    setVisibleCount(0);
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= slotCount) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, phase === "appear" ? 280 : 180);

    return () => clearInterval(interval);
  }, [phase, slotCount]);

  useEffect(() => {
    if (phase !== "scatter") return;

    const interval = setInterval(() => setFloatTick((t) => t + 1), 50);
    return () => clearInterval(interval);
  }, [phase]);

  const isAssembling =
    phase === "assemble" || phase === "complete" || phase === "pulse";
  const heartComplete = phase === "complete" || phase === "pulse";

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <ParticleBackground density={0.00005} />

      <motion.div
        ref={containerRef}
        className="relative w-full max-w-lg flex-1"
        animate={phase === "pulse" ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={
          phase === "pulse"
            ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
            : {}
        }
      >
        {photos.map((photo, index) => {
          if (index >= visibleCount && phase !== "assemble" && phase !== "complete" && phase !== "pulse") {
            return null;
          }

          const visible = index < visibleCount || isAssembling;

          let x = photo.scatter.x;
          let y = photo.scatter.y;
          let rotate = photo.idleRotation;
          let scale = visible ? 1 : 0;

          if (phase === "appear" && index === 0) {
            x = dimensions.width / 2;
            y = dimensions.height / 2;
            rotate = 0;
          } else if (phase === "scatter") {
            x =
              photo.scatter.x +
              Math.sin(floatTick * 0.04 + photo.floatOffset) * 18;
            y =
              photo.scatter.y +
              Math.cos(floatTick * 0.035 + photo.floatOffset) * 14;
            rotate = Math.sin(floatTick * 0.02 + photo.floatOffset) * 8;
          } else if (isAssembling) {
            x = photo.target.x;
            y = photo.target.y;
            rotate = (index % 2 === 0 ? 1 : -1) * 3;
            scale = 1;
          }

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                x: x - photoSize / 2,
                y: y - photoSize / 2,
                scale,
                rotate,
                opacity: visible ? 1 : 0,
              }}
              transition={{
                duration: isAssembling ? 1.5 : 0.7,
                delay: isAssembling ? photo.delay : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute overflow-hidden rounded-xl border-2 border-white/25"
              style={{
                width: photoSize,
                height: photoSize,
                boxShadow: heartComplete
                  ? "0 0 22px rgba(255,45,149,0.4), 0 0 44px rgba(255,45,149,0.15)"
                  : "0 0 14px rgba(255,45,149,0.25)",
              }}
            >
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          );
        })}

        {heartComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0.2] }}
            transition={{ duration: 1.8 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,45,149,0.3) 0%, transparent 55%)",
            }}
          />
        )}
      </motion.div>

      {showFinalMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-8 px-6 text-center"
        >
          <p className="font-display text-[clamp(1.1rem,4.5vw,1.5rem)] text-white/90 glow-pink">
            {birthday.finalMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
}
