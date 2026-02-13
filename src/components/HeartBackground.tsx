"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Generate random hearts with more variety (reduced from 30 to 12 for better performance)
const hearts = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  size: Math.random() * 24 + 12,
  left: Math.random() * 100,
  duration: Math.random() * 25 + 15,
  delay: Math.random() * 15,
  opacity: Math.random() * 0.4 + 0.1,
  char: ['❤', '💕', '💖', '💗', '💝', '💓'][Math.floor(Math.random() * 6)],
}));

export function HeartBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating hearts */}
      <div className="floating-hearts pointer-events-none fixed inset-0 z-0">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              fontSize: heart.size,
              opacity: heart.opacity,
            }}
            initial={{ y: "110vh", x: `${heart.left}vw`, rotate: 0 }}
            animate={{
              y: "-10vh",
              rotate: 360,
              x: `${heart.left + (Math.random() * 15 - 7.5)}vw`,
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear",
            }}
          >
            {heart.char}
          </motion.div>
        ))}
      </div>

      {/* Sparkles effect (reduced from 15 to 6 for better performance) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: Math.random() * 12 + 8,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </>
  );
}
