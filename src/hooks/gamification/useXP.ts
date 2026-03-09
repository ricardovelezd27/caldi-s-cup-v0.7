import { useState, useEffect, useRef } from "react";

export function useXP(targetXP: number, duration = 1500) {
  const [displayedXP, setDisplayedXP] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (targetXP <= 0) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedXP(Math.round(eased * targetXP));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetXP, duration]);

  return displayedXP;
}
