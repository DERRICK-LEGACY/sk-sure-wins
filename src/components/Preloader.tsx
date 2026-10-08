"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset state on route change
    setIsLoading(true);
    setCount(0);

    // Number counter animation
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 1;
      if (current > 100) current = 100;
      setCount(current);
      if (current === 100) {
        clearInterval(interval);
      }
    }, 30); // Or speed it up for route changes if desired

    // Hide preloader after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // reduced from 2500 for a slightly faster route transition

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}>
            <motion.div 
              animate={{ y: [0, 40] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-full h-[200%] absolute top-[-100%]"
            />
          </div>

          {/* Central Animated Logo Element */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Spinning Golden Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border-t-2 border-r-2 border-[#D4AF37]/50 border-b-2 border-b-transparent border-l-2 border-l-transparent"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border-b-2 border-l-2 border-[#F4E3A6]/30 border-t-2 border-t-transparent border-r-2 border-r-transparent"
            />
            
            {/* Glowing Core */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-32 h-32 md:w-48 md:h-48 bg-[#D4AF37]/20 blur-[40px] rounded-full"
            />

            {/* Main Text Content */}
            <div className="relative flex flex-col items-center justify-center mt-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="overflow-hidden flex"
              >
                {['S', 'K', ' ', 'S', 'U', 'R', 'E', ' ', 'W', 'I', 'N', 'S'].map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.3 + (index * 0.05),
                      ease: [0.33, 1, 0.68, 1] 
                    }}
                    className={`text-3xl md:text-5xl font-black tracking-widest ${letter === ' ' ? 'w-3 md:w-4' : ''} ${index > 1 && index < 7 ? 'text-[#D4AF37] glow-text' : 'text-white'}`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>

              {/* Data / Loading Text */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 flex items-center gap-4"
              >
                <span className="text-[10px] md:text-xs font-mono text-[#D4AF37] uppercase tracking-[0.3em]">
                  Initializing Data Models
                </span>
                <span className="text-white font-mono text-lg md:text-xl font-bold">
                  {count}%
                </span>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between items-center z-10 text-[8px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest opacity-50">
            <div>AI ANALYTICS ENGINE v2.0</div>
            <div>[ LOADING SECURE PROTOCOLS ]</div>
            <div className="hidden md:block">PREMIUM VIP ACCESS</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
