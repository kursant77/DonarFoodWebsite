import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  drift: number;
}

export default function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create 50 snowflakes with random properties
    const createSnowflakes = () => {
      const flakes: Snowflake[] = [];
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100, // Random horizontal position (0-100%)
          delay: Math.random() * 5, // Random delay (0-5s)
          duration: 10 + Math.random() * 20, // Random fall duration (10-30s)
          size: 4 + Math.random() * 6, // Random size (4-10px)
          opacity: 0.3 + Math.random() * 0.5, // Random opacity (0.3-0.8)
          drift: (Math.random() - 0.5) * 50, // Random horizontal drift (-25px to 25px)
        });
      }
      setSnowflakes(flakes);
    };

    createSnowflakes();
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white select-none"
            style={{
              left: `${flake.left}%`,
              top: "-20px",
              fontSize: `${flake.size}px`,
              opacity: flake.opacity,
              animation: `snowfall-${flake.id} ${flake.duration}s linear ${flake.delay}s infinite`,
              animationFillMode: "both",
            }}
          >
            ❄
          </div>
        ))}
      </div>
      <style>{`
        ${snowflakes
          .map(
            (flake) => `
          @keyframes snowfall-${flake.id} {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
              opacity: ${flake.opacity};
            }
            100% {
              transform: translateY(calc(100vh + 20px)) translateX(${flake.drift}px) rotate(360deg);
              opacity: 0;
            }
          }
        `
          )
          .join("")}
      `}</style>
    </>
  );
}
