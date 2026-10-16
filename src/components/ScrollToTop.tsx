"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }

      // Show after scrolling past 280px
      setShow(scrollTop > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG circle calculations
  const size = 44;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-[4.5rem] sm:bottom-28 right-3.5 sm:right-6 z-40 pointer-events-none"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="pointer-events-auto group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0A0A0F]/90 hover:bg-[#111116] text-[#D4AF37] backdrop-blur-md border border-[var(--glass-border)] hover:border-[#D4AF37]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Ambient gold glow on hover */}
            <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

            {/* Circular Progress SVG */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-white/10"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress fill */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-[#D4AF37] transition-all duration-150 ease-out drop-shadow-[0_0_4px_rgba(212,175,55,0.8)]"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Chevron Icon */}
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform duration-200 relative z-10" />

            <span className="sr-only">Scroll to top</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
