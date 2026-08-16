import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthday } from "../data/birthday";

interface MatrixIntroProps {
  onComplete: () => void;
}

const CHARS =
  "アイウエオカキクケコ0123456789ABCDEF<>{}[]/\\|01♥♡01";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

type IntroPhase = "matrix" | "count" | "text" | "heart" | "zoom";

export default function MatrixIntro({ onComplete }: MatrixIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const frameRef = useRef(0);

  const [phase, setPhase] = useState<IntroPhase>("matrix");
  const [countIndex, setCountIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [zooming, setZooming] = useState(false);

  const initMatrix = useCallback((width: number, height: number) => {
    const colWidth = 16;
    const isMobile = width < 768;
    const maxCols = isMobile ? 28 : 48;
    const cols = Math.min(Math.floor(width / colWidth), maxCols);
    columnsRef.current = Array.from({ length: cols }, (_, i) => ({
      x: i * colWidth,
      y: Math.random() * height,
      speed: Math.random() * 2 + 1,
      length: Math.floor(Math.random() * 18) + 6,
      chars: Array.from({ length: 30 }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)],
      ),
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initMatrix(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const draw = () => {
      if (!running) return;

      ctx.fillStyle = "rgba(5, 5, 8, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = "11px JetBrains Mono, monospace";

      for (const col of columnsRef.current) {
        for (let i = 0; i < col.length; i++) {
          const y = col.y - i * 14;
          if (y < -20 || y > window.innerHeight + 20) continue;

          const alpha = Math.max(0, 1 - i / col.length);
          const isHead = i === 0;

          ctx.shadowBlur = isHead ? 12 : 4;
          ctx.shadowColor = "rgba(255, 45, 149, 0.8)";
          ctx.fillStyle = isHead
            ? `rgba(255, 110, 180, ${alpha})`
            : `rgba(255, 45, 149, ${alpha * 0.55})`;

          const char = col.chars[(Math.floor(col.y / 14) + i) % col.chars.length];
          ctx.fillText(char, col.x, y);
        }

        col.y += col.speed;
        if (col.y > window.innerHeight + col.length * 14) {
          col.y = -col.length * 14;
          col.speed = Math.random() * 2 + 1;
        }
      }

      ctx.shadowBlur = 0;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [initMatrix]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("count"), 2200));

    birthday.countSequence.forEach((_, i) => {
      timers.push(
        setTimeout(() => setCountIndex(i), 2800 + i * 900),
      );
    });

    const textDelay = 2800 + birthday.countSequence.length * 900 + 400;
    timers.push(setTimeout(() => setPhase("text"), textDelay));

    timers.push(setTimeout(() => {
      setPhase("heart");
      setShowHeart(true);
    }, textDelay + 1800));

    timers.push(setTimeout(() => setPhase("zoom"), textDelay + 3800));
    timers.push(setTimeout(() => setZooming(true), textDelay + 4200));
    timers.push(setTimeout(() => onComplete(), textDelay + 5800));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const currentNumber =
    phase === "count" || phase === "text" || phase === "heart" || phase === "zoom"
      ? birthday.countSequence[countIndex]
      : null;

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden bg-dark-navy"
      animate={zooming ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "count" && (
            <motion.span
              key={`num-${countIndex}`}
              initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.3, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[clamp(5rem,22vw,9rem)] font-medium text-neon-pink glow-pink"
            >
              {currentNumber}
            </motion.span>
          )}

          {phase === "text" && (
            <motion.span
              key="birthday-text"
              initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.25em" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[clamp(1.5rem,7vw,3rem)] font-medium uppercase text-neon-pink glow-pink"
            >
              {birthday.introText}
            </motion.span>
          )}
        </AnimatePresence>

        {showHeart && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: phase === "zoom" ? 1.4 : 1,
            }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: phase === "zoom" ? 1.8 : 1, ease: [0.22, 1, 0.36, 1] },
            }}
            className="absolute flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                filter: [
                  "drop-shadow(0 0 30px rgba(255,45,149,0.6))",
                  "drop-shadow(0 0 60px rgba(255,45,149,0.9))",
                  "drop-shadow(0 0 30px rgba(255,45,149,0.6))",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="neon-heart text-[clamp(6rem,28vw,12rem)] text-neon-pink"
            >
              ♥
            </motion.div>

            {phase === "zoom" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.5],
                      x: Math.cos((i / 12) * Math.PI * 2) * 80,
                      y: Math.sin((i / 12) * Math.PI * 2) * 80,
                    }}
                    transition={{ duration: 1.2, delay: i * 0.05 }}
                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-neon-pink"
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
