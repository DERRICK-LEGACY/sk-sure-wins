import Image from 'next/image';
import { BookOpen, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookSection({ openModal }: { openModal: (name: string, price: string) => void }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1a1525] to-black border border-primary/20 overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.15)] flex flex-col md:flex-row items-center p-8 md:p-12 gap-10 md:gap-16">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Book Image */}
        <div className="w-full md:w-1/2 flex justify-center relative z-10">
          <div className="relative w-full max-w-[240px] sm:max-w-[300px] group">
            {/* Glow behind book */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-yellow-600 opacity-40 blur-2xl rounded-2xl group-hover:opacity-70 transition duration-500"></div>
            
            <Image
              src="/book-cover.jpg"
              alt="SK's Book"
              width={600}
              height={850}
              className="relative rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 w-full h-auto object-contain z-10"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10 mt-4 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-sm uppercase tracking-widest mb-6">
            <BookOpen size={16} />
            <span>New Release</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 text-white tracking-tight uppercase">
            THE DEEP <span className="text-primary">TRUTH</span>
          </h2>
          <h3 className="text-lg md:text-xl font-bold text-white/90 mb-6 uppercase tracking-widest">
            In The Business Of Betting
          </h3>
          
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-md font-medium">
            Learn how to win in sports betting. The only guide you need.
          </p>

          <div className="flex flex-col w-full items-center md:items-start gap-4">
            <div className="flex flex-row items-end gap-3">
              <div className="text-5xl font-black text-white">
                35K <span className="text-xl text-gray-500 font-normal">UGX</span>
              </div>
              <div className="text-2xl font-bold text-gray-500 line-through mb-1 opacity-70">
                45K
              </div>
            </div>
            
            <button 
              onClick={() => openModal("Book: AMAZIMA AMAKUSIKE", "35,000")} 
              className="w-full sm:w-4/5 md:w-auto mt-2 bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-extrabold py-5 px-10 rounded-xl transition-all shadow-[0_5px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_8px_25px_rgba(234,179,8,0.6)] uppercase tracking-wider text-lg hover:-translate-y-1 active:translate-y-0"
            >
              Buy Book Now
            </button>
          </div>
          
          {/* Trust badges */}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-10 text-gray-400 text-sm font-semibold w-full">
            <div className="flex items-center gap-2">
              <Star className="text-primary" size={18} fill="currentColor" />
              <span>Top Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary" size={18} />
              <span>Proven Strategy</span>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
