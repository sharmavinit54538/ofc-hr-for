import { useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";

/**
 * Magnetic 3D tilt driven by pointer position. Purely presentational.
 */
export function useTilt(max = 5) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const config = { stiffness: 220, damping: 20, mass: 0.6 };
  const sx = useSpring(x, config);
  const sy = useSpring(y, config);

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    handlers: { onMouseMove, onMouseLeave },
    style: reduced
      ? {}
      : { rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" as const },
  };
}
