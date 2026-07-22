"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#1a1525]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-3 relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-lg blur opacity-40"></div>
              <img src="/sklogo.jpeg" alt="Logo" className="w-12 h-12 rounded-lg object-contain relative z-10 border border-white/10 shadow-lg bg-black" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-white leading-none">SK SURE <span className="text-primary">WINS</span></h1>
              <p className="text-[10px] text-primary uppercase tracking-widest font-bold hidden sm:block mt-1">Munakapapula</p>
            </div>
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-gray-300">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="/free-tickets" className="hover:text-primary transition-colors">Free Tickets</a>
          <a href="/won-tickets" className="hover:text-primary transition-colors">Won Tickets</a>
          <a href="/#packages" className="hover:text-primary transition-colors">Packages</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="https://whatsapp.com/channel/0029Vb74ody59PwPUG2F8G1h" target="_blank" className="bg-gradient-to-r from-[#25D366] to-[#1da851] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] flex items-center gap-2">
            <WhatsAppIcon className="w-5 h-5 text-black" />
            Contact Us
          </a>
          <a href="/login">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold px-6 py-2 rounded-full transition-all text-sm shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              VIP Login
            </motion.button>
          </a>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <a href="/login" className="text-primary text-xs font-bold border border-primary px-3 py-1.5 rounded-full relative z-50">VIP</a>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white relative z-50">
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#0f0a14]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <a href="/" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Home</a>
            <a href="/free-tickets" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Free Tickets</a>
            <a href="/won-tickets" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Won Tickets</a>
            <a href="/#packages" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Packages</a>
            <a href="https://whatsapp.com/channel/0029Vb74ody59PwPUG2F8G1h" target="_blank" className="bg-gradient-to-r from-[#25D366] to-[#1da851] text-black font-bold px-8 py-4 rounded-full text-xl mt-6 flex items-center gap-3 shadow-[0_0_30px_rgba(37,211,102,0.4)]">
              <WhatsAppIcon className="w-7 h-7 text-black" />
              Contact Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
