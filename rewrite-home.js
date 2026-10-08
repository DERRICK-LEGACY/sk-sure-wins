const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// Replace Hero
const heroStart = '{/* HERO SECTION WITH VIDEO BACKGROUND */}';
const heroEnd = '{/* SPECIAL OFFER BANNER (If Active) */}';
const newHero = `        {/* PREMIUM HERO SECTION */}
        <section className="relative w-full flex flex-col items-center justify-center pt-40 pb-32 px-6 text-center overflow-hidden min-h-[85vh]">
          {/* VIDEO BACKGROUND */}
          <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0A0A0F] z-0"></div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto mt-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border border-white/10 text-white/80 text-[10px] md:text-xs font-black tracking-[0.2em] mb-10 uppercase shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              Uganda's Most Trusted Sports Analysts
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-8 tracking-tighter leading-[1.05] text-white">
              Data-Driven <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E3A6] to-[#B5952F]">Premium Analytics.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 max-w-2xl text-lg md:text-xl font-medium mb-12">
              Join thousands of serious bettors who trust our expert insights, transparent track record, and guaranteed VIP packages to maximize their weekly profit.
            </motion.p>

            {/* JOIN CHANNELS FUNNEL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-xl"
            >
              <a
                href="https://whatsapp.com/channel/0029Vb8yLOm1yT2CHUu2k70o"
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-black font-black py-4 px-8 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span className="text-[15px] tracking-wide">Join WhatsApp</span>
              </a>

              <a
                href="https://t.me/+Gd917QQhofRiZGVk"
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1A1A24] text-white border border-white/10 font-bold py-4 px-8 rounded-full hover:bg-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <TelegramIcon className="w-5 h-5 text-[#0088cc]" />
                <span className="text-[15px] tracking-wide">Join Telegram</span>
              </a>
            </motion.div>
          </div>
        </section>

        `;
code = code.substring(0, code.indexOf(heroStart)) + newHero + code.substring(code.indexOf(heroEnd));

// Replace Special Offer
const offerStart = '{/* SPECIAL OFFER BANNER (If Active) */}';
const offerEnd = '{/* PAGE CONTENT CONTAINER */}';
const newOffer = `{/* PREMIUM SPECIAL OFFER BANNER (If Active) */}
        {specialOffer && (
          <div className="w-full max-w-5xl mx-auto px-6 mb-16 -mt-10 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-[#111116] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#d4af37]/30 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#d4af37]/5 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="inline-block bg-[#1A1A24] border border-white/10 text-[#d4af37] text-[10px] sm:text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full mb-4">
                  🔥 LIMITED TIME OFFER
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                  {specialOffer.name}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base font-medium">
                  Exclusive VIP Access • Instant Win • {specialOffer.durationDays} Days
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 relative z-10 shrink-0 w-full md:w-auto">
                <div className="text-4xl sm:text-5xl font-black text-[#d4af37]">
                  {specialOffer.price.toLocaleString()} UGX
                </div>
                <button 
                  onClick={() => openModal(specialOffer.name, \`\${Math.floor(specialOffer.price / 1000)}k\`)} 
                  className="w-full md:w-auto bg-[#d4af37] text-black font-black py-4 px-10 rounded-xl hover:bg-[#F4E3A6] transition-colors uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                >
                  <span>BUY NOW</span>
                  <Send size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        `;
code = code.substring(0, code.indexOf(offerStart)) + newOffer + code.substring(code.indexOf(offerEnd));

fs.writeFileSync('src/components/HomePage.tsx', code);
