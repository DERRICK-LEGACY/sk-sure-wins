"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${scrolled ? "py-1" : "py-0"}`}>
        <nav className={`relative w-full max-w-7xl mx-auto glass-panel transition-all duration-300 flex justify-between items-center shadow-lg ${scrolled ? "py-2 sm:py-3 px-4 sm:px-6 rounded-full border border-[var(--glass-border)] mt-2" : "py-3 sm:py-4 px-4 border-b border-[var(--glass-border)] rounded-none"}`}>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 relative z-50 group">
              <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <Image src="/sklogo.jpeg" alt="Logo" width={50} height={50} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover relative z-10 border-2 border-[var(--glass-border)] shadow-lg bg-black" />
              </div>
              <div className="shrink-0 flex flex-col justify-center">
                <h1 className="font-extrabold text-sm sm:text-lg md:text-xl tracking-tight text-foreground leading-none group-hover:text-[#D4AF37] transition-colors">SK SURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] glow-text">WINS</span></h1>
                <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold hidden sm:block mt-1">Munakapapula</p>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:scale-105 transition-all">Home</Link>
            <Link href="/free-tickets" className="hover:text-foreground hover:scale-105 transition-all">Free Tickets</Link>
            <Link href="/won-tickets" className="hover:text-foreground hover:scale-105 transition-all">Won Tickets</Link>
            <Link href="/#packages" className="hover:text-foreground hover:scale-105 transition-all">Packages</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#111116] to-[#1a1a24] border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:border-[#D4AF37]/60 hover:scale-105 transition-all px-5 py-2.5 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Crown className="w-5 h-5 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] relative z-10" />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8D6] via-[#D4AF37] to-[#B5952F] tracking-widest uppercase text-sm drop-shadow-md relative z-10">VIP LOGIN</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link href="/login" className="group flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#111116] to-[#1a1a24] border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all px-3 py-1.5 rounded-full relative z-50 overflow-hidden">
              <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8D6] to-[#D4AF37] tracking-wider uppercase text-[10px] mt-0.5 relative z-10">LOGIN</span>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground relative z-50 p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-card border-l border-[var(--glass-border)] z-50 flex flex-col p-8 md:hidden shadow-2xl"
            >
              <div className="flex flex-col gap-6 mt-16">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-foreground hover:text-[#D4AF37] transition-colors border-b border-[var(--glass-border)] pb-4">Home</Link>
                <Link href="/free-tickets" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-foreground hover:text-[#D4AF37] transition-colors border-b border-[var(--glass-border)] pb-4">Free Tickets</Link>
                <Link href="/won-tickets" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-foreground hover:text-[#D4AF37] transition-colors border-b border-[var(--glass-border)] pb-4">Won Tickets</Link>
                <Link href="/#packages" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-foreground hover:text-[#D4AF37] transition-colors border-b border-[var(--glass-border)] pb-4">Packages</Link>
                <a href="https://whatsapp.com/channel/0029Vb8yLOm1yT2CHUu2k70o" target="_blank" className="bg-gradient-to-r from-[#25D366] to-[#1da851] text-black font-bold px-6 py-4 rounded-xl text-lg mt-4 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <WhatsAppIcon className="w-6 h-6 text-black" />
                  Contact Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
