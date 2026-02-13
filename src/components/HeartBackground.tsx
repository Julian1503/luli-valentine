"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Generate random hearts
const hearts = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: Math.random() * 20 + 10,
  left: Math.random() * 100,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 10,
}));

export function HeartBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="floating-hearts pointer-events-none fixed inset-0 z-0 opacity-40">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary/20"
          initial={{ y: "110vh", x: `${heart.left}vw`, rotate: 0 }}
          animate={{ 
            y: "-10vh", 
            rotate: 360,
            x: `${heart.left + (Math.random() * 10 - 5)}vw` // Mild swaying
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          style={{ fontSize: heart.size }}
        >
          ❤
        </motion.div>
      ))}
    </div>
  );
}
