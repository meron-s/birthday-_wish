import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SceneTransitionProps {
  children: ReactNode;
  sceneKey: string;
  className?: string;
}

export default function SceneTransition({
  children,
  sceneKey,
  className = "",
}: SceneTransitionProps) {
  return (
    <motion.div
      key={sceneKey}
      initial={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}
