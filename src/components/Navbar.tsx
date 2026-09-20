"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[60]">
        <nav className="relative w-full max-w-full glass-panel py-2 sm:py-3 px-4 flex justify-between items-center shadow-2xl overflow-hidden rounded-none border-t-0 border-x-0 border-b border-white/5">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 relative z-50 group">
            <div className="relative shrink-0 transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <Image src="/sklogo.jpeg" alt="Logo" width={50} height={50} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover relative z-10 border-2 border-white/10 shadow-lg bg-black" />
            </div>
            <div className="shrink-0">
              <h1 className="font-extrabold text-sm sm:text-lg md:text-xl tracking-tight text-white leading-none group-hover:text-[#FFF8D6] transition-colors">SK SURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] glow-text">WINS</span></h1>
              <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold hidden sm:block mt-1">Munakapapula</p>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/free-tickets" className="hover:text-white transition-colors">Free Tickets</Link>
          <Link href="/won-tickets" className="hover:text-white transition-colors">Won Tickets</Link>
          <Link href="/#packages" className="hover:text-white transition-colors">Packages</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#111116] to-[#1a1a24] border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:border-[#D4AF37]/60 hover:scale-105 transition-all px-4 lg:px-6 py-2 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] relative z-10" />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8D6] via-[#D4AF37] to-[#B5952F] tracking-widest uppercase text-sm lg:text-base drop-shadow-md relative z-10">VIP LOGIN</span>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3 shrink-0">
          <Link href="/login" className="group flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#111116] to-[#1a1a24] border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-all px-3 py-1.5 rounded-full relative z-50 overflow-hidden">
            <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8D6] to-[#D4AF37] tracking-wider uppercase text-[10px] mt-0.5 relative z-10">VIP LOGIN</span>
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white relative z-50 p-1">
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
        </div>
      </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#0f0a14]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Home</Link>
            <Link href="/free-tickets" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Free Tickets</Link>
            <Link href="/won-tickets" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Won Tickets</Link>
            <Link href="/#packages" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Packages</Link>
            <a href="https://whatsapp.com/channel/0029Vb8yLOm1yT2CHUu2k70o" target="_blank" className="bg-gradient-to-r from-[#25D366] to-[#1da851] text-black font-bold px-8 py-4 rounded-full text-xl mt-6 flex items-center gap-3 shadow-[0_0_30px_rgba(37,211,102,0.4)]">
              <WhatsAppIcon className="w-7 h-7 text-black" />
              Contact Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
