"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      // Show only when scrolled a tiny bit so it doesn't show an empty bar at the very top
      setIsVisible(window.scrollY > 10);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 w-full max-w-full overflow-hidden h-[3px] z-[100] pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Background Track */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Glowing Progress Fill */}
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#00F0FF] shadow-[0_0_12px_rgba(212,175,55,0.8),0_0_20px_rgba(0,240,255,0.4)] relative"
        style={{ scaleX }}
      >
        {/* Leading Edge Sparkle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_8px_#FFF8D6]" />
      </motion.div>
    </div>
  );
}
