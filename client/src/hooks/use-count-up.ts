import { useEffect, useState, useRef } from "react";

interface UseCountUpProps {
  end: number;
  duration?: number;
  start?: number;
  enabled?: boolean;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp({
  end,
  duration = 2000,
  start = 0,
  enabled = true,
  decimals = 0,
  suffix = "",
  prefix = "",
}: UseCountUpProps) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      setCount(end);
      return;
    }

    setIsAnimating(true);
    setCount(start);
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start, enabled]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals)
    : Math.floor(count).toString();

  return {
    count: formattedCount,
    displayValue: `${prefix}${formattedCount}${suffix}`,
    isAnimating,
  };
}
