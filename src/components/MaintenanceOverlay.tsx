"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, CloudOff, RefreshCw, ShieldAlert } from "lucide-react";

export function MaintenanceOverlay() {
  // Set the timer to 8 hours from now
  const [targetTime] = useState(() => new Date(Date.now() + 8 * 60 * 60 * 1000).getTime());
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 0,
    seconds: 0,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Prevent scrolling on the body when overlay is active
    document.body.style.overflow = "hidden";
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, [targetTime]);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0F] p-4 md:p-8 overflow-y-auto"
      >
        {/* Background abstract shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#D4AF37]/10 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px]"
          />
        </div>

        {/* Main Card Container */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl my-auto bg-[#111116] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        >
          {/* Left Column: Text & Timer */}
          <div className="w-full lg:w-1/2 p-8 sm:p-10 md:p-14 flex flex-col justify-center relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <CloudOff size={100} />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit mb-2 tracking-tight text-white uppercase">
              System
              <br />
              <span className="text-[#D4AF37]">Update</span>
            </h1>
            
            <p className="text-zinc-400 text-base sm:text-lg mt-4 mb-8 leading-relaxed max-w-md">
              We are currently performing scheduled maintenance to upgrade our servers. This ensures a faster and more secure experience for all our VIP members.
            </p>

            {/* Timer */}
            <div className="mb-8">
              <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest font-bold mb-3">Estimated Time Remaining</p>
              <div className="flex gap-2 sm:gap-4 items-center">
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <span className="text-xl sm:text-2xl font-bold text-zinc-700 pb-4 sm:pb-6">:</span>
                <TimeUnit value={timeLeft.minutes} label="Minutes" />
                <span className="text-xl sm:text-2xl font-bold text-zinc-700 pb-4 sm:pb-6">:</span>
                <TimeUnit value={timeLeft.seconds} label="Seconds" />
              </div>
            </div>

            <div className="mt-auto">
              <div className="inline-flex items-start gap-3 bg-[#D4AF37]/10 p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/20">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-xs sm:text-sm">Your Data is Safe</h4>
                  <p className="text-zinc-400 text-[10px] sm:text-xs mt-1">All active subscriptions and VIP tickets are securely backed up. They will be immediately available once we are back online.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Illustration/Graphic area */}
          <div className="w-full lg:w-1/2 bg-[#1A1A24] p-8 sm:p-10 md:p-14 flex items-center justify-center relative overflow-hidden min-h-[300px] lg:min-h-0">
            {/* Abstract clock in background */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] border border-white/5 rounded-full border-dashed opacity-50 pointer-events-none"
            />
            
            {/* Mockup "Screen" */}
            <div className="relative w-full max-w-sm bg-[#252532] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-10">
              {/* Browser/Window Header */}
              <div className="bg-[#1F1F2A] px-3 py-2 sm:px-4 sm:py-3 border-b border-white/5 flex items-center gap-2">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto flex items-center gap-2 text-zinc-500 text-[10px] sm:text-xs font-mono truncate px-2">
                  <RefreshCw size={10} className="animate-spin shrink-0" />
                  <span className="truncate">sksurewinspredictions.com</span>
                </div>
              </div>

              {/* Window Body */}
              <div className="p-6 sm:p-10 flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1E28] to-[#15151D]">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-6 sm:mb-8">
                  {/* Large Gear */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute text-[#D4AF37]"
                  >
                    <Settings size={64} className="sm:w-20 sm:h-20" />
                  </motion.div>
                  {/* Small Gear */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    className="absolute text-white/80 translate-x-10 translate-y-6 sm:translate-x-12 sm:translate-y-8"
                  >
                    <Settings size={32} className="sm:w-10 sm:h-10" />
                  </motion.div>
                </div>

                <h3 className="text-white font-bold text-lg sm:text-xl mb-2 tracking-wide">UPDATING...</h3>
                
                {/* Progress Bar Container */}
                <div className="w-full h-2.5 sm:h-3 bg-black/50 rounded-full overflow-hidden mt-3 sm:mt-4 relative border border-white/5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]"
                  />
                  {/* Shimmer effect on progress bar */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-white/20 skew-x-12"
                  />
                </div>
                <div className="text-[#D4AF37] font-mono text-xs sm:text-sm mt-3 font-bold">85% Complete</div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#1A1A24] border border-white/10 w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 rounded-2xl flex items-center justify-center shadow-lg mb-1 sm:mb-2 relative overflow-hidden">
        {/* Glossy highlight */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-space relative z-10">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}
