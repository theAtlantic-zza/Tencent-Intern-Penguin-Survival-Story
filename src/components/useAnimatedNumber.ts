import { useEffect, useRef, useState } from 'react';

/**
 * 数字滚动动画：value 变化时，从旧值 tween 到新值
 */
export function useAnimatedNumber(value: number, duration = 400): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (display === value) return;
    fromRef.current = display;
    startTimeRef.current = performance.now();

    const tick = (t: number) => {
      const elapsed = t - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(progress >= 1 ? value : Math.round(next));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}
