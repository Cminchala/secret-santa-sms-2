"use client";

import { useEffect, useState } from "react";

type Flake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  char: string;
};

const FLAKE_CHARS = ["❄", "❅", "❆", "•"];

/**
 * Full-screen falling snow. Flakes are generated on the client only
 * to avoid hydration mismatches from Math.random().
 */
export function Snowfall({ count = 70 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 18,
        duration: 8 + Math.random() * 12,
        delay: -Math.random() * 20,
        drift: -40 + Math.random() * 80,
        opacity: 0.4 + Math.random() * 0.6,
        char: FLAKE_CHARS[Math.floor(Math.random() * FLAKE_CHARS.length)],
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={
            {
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`,
            } as React.CSSProperties
          }
        >
          {f.char}
        </span>
      ))}
      {/* snowy ground */}
      <div className="snow-ground" />
    </div>
  );
}

