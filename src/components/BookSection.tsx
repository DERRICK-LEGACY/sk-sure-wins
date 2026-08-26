import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookSection({ openModal }: { openModal: (name: string, price: string) => void }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12 text-left"
    >
      <div className="w-full md:w-1/2">
        <h4 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 flex items-center gap-2">
          <BookOpen size={18} /> Exclusive Release
        </h4>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
          AMAZIMA <span className="text-primary">AMAKUSIKE</span>
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          The ultimate guide to sports betting success. Learn the secrets of the trade, risk management, and how to consistently beat the bookies. Written by Uganda's most trusted sports betting expert.
        </p>
        <div className="bg-[#1a1525] border border-primary/20 rounded-2xl p-6 mb-8 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
          <h5 className="text-white font-bold mb-3">What's inside?</h5>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li className="flex items-center gap-2">✓ Advanced bankroll management</li>
            <li className="flex items-center gap-2">✓ How to identify value bets</li>
            <li className="flex items-center gap-2">✓ Psychological discipline for bettors</li>
            <li className="flex items-center gap-2">✓ Analyzing team stats like a pro</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-4xl font-black text-white">35K <span className="text-sm text-gray-500 font-normal">UGX</span></div>
          <button 
            onClick={() => openModal("Book: AMAZIMA AMAKUSIKE", "35,000")} 
            className="w-full sm:w-auto bg-primary hover:bg-[#d4af37] text-black font-extrabold py-4 px-10 rounded-xl transition-colors shadow-[0_5px_15px_rgba(234,179,8,0.3)] uppercase tracking-wider hover:scale-105"
          >
            Buy the Book
          </button>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-30 blur-xl rounded-3xl group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black/50 aspect-[3/4]">
          <Image
            src="/book-cover.jpg"
            alt="AMAZIMA AMAKUSIKE Book Cover"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </motion.section>
  );
}
