const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// 1. REWRITE PREMIUM / LIFE CHANGER SECTION
const premiumStart = `          {/* BOTTOM PREMIUM SPLIT BANNER */}`;
const premiumEnd = `            {/* LEFT SIDE - PREMIUM OFFER */}`;
// wait, we can just replace the whole BOTTOM PREMIUM SPLIT BANNER.
const premiumFullStart = `          {/* BOTTOM PREMIUM SPLIT BANNER */}`;
const premiumFullEnd = `            </>
          )}

        </div>`;

// let's create the new premium split banner
const newPremiumBanner = `          {/* BOTTOM PREMIUM SPLIT BANNER */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-5xl grid md:grid-cols-2 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative mb-16 mx-4 md:mx-auto">

            {/* HYPER GLOW BACKGROUND */}
            <div className="absolute inset-0 bg-[#0A0A0F] z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-[#D4AF37]/20 blur-[80px] z-0"></div>

            {/* BALL ICON IN CENTER */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex w-24 h-24 bg-black/80 backdrop-blur-xl rounded-full items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden p-3 border border-[#D4AF37]/30 group">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-full h-full relative">
                <svg viewBox="0 0 512 512" className="w-full h-full text-[#D4AF37] fill-current drop-shadow-[0_0_10px_#D4AF37]"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM130.3 358L205 283.4 121.7 200l-63 87.2c16 31.7 39.8 59 69 79.1l2.5-8.2zm112.5-98.8L168.1 184.4l49.8-96c12-3.2 24.9-5.1 38.1-5.1 14.8 0 29.2 2.3 42.9 6.4l43.8 91.5-99.9 78zm138.8 80l-85.1 53-83.3-88.6 98.7-77 69.7 112.5zm19.6-32.9L334 198.5l90.3-81c25 21.6 44.5 49.3 56.4 81l-79.6 107.8zm-153.3 121L149 365l-6.2 20.3c31.6 20.8 69.3 33 109.4 34.6l-4.4-92.6z" /></svg>
              </motion.div>
            </div>

            {/* LEFT SIDE - PREMIUM OFFER */}
            <div className="p-8 md:p-12 flex flex-col relative overflow-hidden group border-b md:border-b-0 md:border-r border-white/10 z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent transition-opacity group-hover:bg-blue-500/15"></div>
              <motion.div 
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"
                animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              ></motion.div>

              <div className="z-10 mb-8 flex-1">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start border-b border-white/10 pb-4">
                  <Zap className="text-blue-400" size={28} />
                  <h3 className="text-white text-3xl font-black uppercase tracking-widest text-center md:text-left drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">PREMIUM OFFER</h3>
                </div>
                <p className="text-blue-400/80 text-sm font-black mb-6 text-center md:text-left tracking-widest uppercase">3 Weeks Subscription</p>
                <div className="space-y-3 text-base font-bold text-gray-200">
                  {[
                    { name: "Premium: Rent Project", price: "50,000", label: "Rent Project" },
                    { name: "Premium: Boda boda Project", price: "50,000", label: "Boda boda Project" },
                    { name: "Premium: Back to school Project", price: "50,000", label: "Back to school" },
                    { name: "Premium: 1M in 5 days", price: "50,000", label: "1M in 5 days" }
                  ].map((pkg, idx) => (
                    <button key={idx} onClick={() => openModal(pkg.name, pkg.price)} className="relative w-full flex justify-between items-center px-5 py-4 rounded-2xl bg-black/40 hover:bg-blue-900/20 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group/btn overflow-hidden shadow-lg backdrop-blur-sm">
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 group-hover/btn:w-full transition-all duration-500 z-20"></div>
                      <span className="flex items-center gap-3 text-white text-sm xl:text-base pr-2 relative z-10 font-black tracking-wide">
                        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] shrink-0 animate-pulse"></div> 
                        <span className="truncate">{pkg.label}</span>
                      </span>
                      <span className="bg-blue-500 text-white text-[10px] xl:text-xs font-black px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover/btn:scale-110 transition-transform shrink-0 whitespace-nowrap relative z-10 flex items-center gap-1">
                        <ShoppingCart size={12} /> BUY NOW
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="z-10 flex items-center justify-between">
                <div className="hidden md:block text-right text-6xl text-white/5 font-light pr-8 transform scale-y-[2]">{'}'}</div>
                <div className="text-5xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] ml-auto md:ml-0">50K</div>
              </div>
            </div>

            {/* RIGHT SIDE - LIFE CHANGER */}
            <div className="p-8 md:p-12 flex flex-col relative overflow-hidden group z-10">
              <div className="absolute inset-0 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent transition-opacity group-hover:bg-[#D4AF37]/15"></div>
              <motion.div 
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] pointer-events-none"
                animate={{ opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>

              <div className="z-10 mb-8 flex-1">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start border-b border-white/10 pb-4 md:pl-6">
                  <Trophy className="text-[#D4AF37]" size={28} />
                  <h3 className="text-white text-3xl font-black uppercase tracking-widest text-center md:text-left drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">LIFE CHANGER</h3>
                </div>
                <p className="text-[#D4AF37]/80 text-sm font-black mb-6 text-center md:text-left tracking-widest uppercase md:pl-6">2 Weeks Subscription</p>
                <div className="space-y-3 text-base font-black text-white/90 md:pl-6">
                  {[
                    { name: "Life Changer: ODD 1.20", price: "50,000", label: "ODD 1.20" },
                    { name: "Life Changer: ODD 1.50", price: "60,000", label: "ODD 1.50" },
                    { name: "Life Changer: ODD 2", price: "100,000", label: "ODD 2" },
                    { name: "Life Changer: ODD 3", price: "200,000", label: "ODD 3" }
                  ].map((pkg, idx) => (
                    <button key={idx} onClick={() => openModal(pkg.name, pkg.price)} className="relative w-full flex justify-between items-center px-5 py-4 rounded-2xl bg-black/40 hover:bg-[#D4AF37]/10 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group/btn overflow-hidden shadow-lg backdrop-blur-sm">
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D4AF37] group-hover/btn:w-full transition-all duration-500 z-20"></div>
                      <span className="flex items-center gap-3 text-sm xl:text-base pr-2 relative z-10 tracking-wide">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)] shrink-0 animate-pulse"></div> 
                        <span className="truncate">{pkg.label}</span>
                      </span>
                      <span className="bg-gradient-to-r from-[#D4AF37] to-[#F9D976] text-black text-[10px] xl:text-xs font-black px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.5)] group-hover/btn:scale-110 transition-transform shrink-0 whitespace-nowrap relative z-10 flex items-center gap-1">
                        <ShoppingCart size={12} /> BUY NOW
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="z-10 flex items-center justify-between">
                <div className="hidden md:block text-right text-6xl text-white/5 font-light pr-8 transform scale-y-[2]">{'}'}</div>
                <div className="text-5xl font-black text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] ml-auto md:ml-0">150K</div>
              </div>
            </div>

          </motion.div>
            </>
          )}

        </div>`;

let startIndex = code.indexOf(premiumStart);
let endIndex = code.indexOf(premiumEnd, startIndex);
let fullEndIndex = code.indexOf(premiumFullEnd, startIndex) + premiumFullEnd.length;

if (startIndex !== -1 && fullEndIndex !== -1) {
    code = code.substring(0, startIndex) + newPremiumBanner + code.substring(fullEndIndex);
    console.log("Replaced Premium Banner");
} else {
    console.log("Could not find premium banner section.");
}

// 2. REWRITE TESTIMONIALS SECTION
const testStart = `      {/* TESTIMONIALS SECTION */}`;
const testEnd = `      {/* SOCIAL MEDIA SECTION */}`;

const newTestimonials = `      {/* TESTIMONIALS SECTION */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="w-full max-w-7xl mx-auto py-24 px-6 relative overflow-hidden">
        {/* HYPER BACKGROUND FOR TESTIMONIALS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <h4 className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Verified Reviews</h4>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Real Winners. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9D976] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Real Results.</span>
            </h2>
          </div>
          <button onClick={() => setTestModalOpen(true)} className="group relative bg-[#111116] text-[#D4AF37] font-black px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] border border-[#D4AF37]/30 hover:border-[#D4AF37] overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center gap-2">Write a Review <CheckCircle size={18} /></span>
          </button>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {allTestimonials.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#0A0A0F]/80 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl">
              <p className="text-gray-400 font-medium text-lg">No testimonials yet. Be the first to share your winning story!</p>
            </div>
          ) : (
            allTestimonials.map((t, i) => (
              <motion.div variants={itemVariants} key={t.id || i} className="bg-[#08080A]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-[#D4AF37]/30 shadow-2xl relative group transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                {/* Glowing orb effect on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/20 transition-colors duration-500">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                </div>

                <div className="flex gap-1 text-[#D4AF37] mb-6 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-xl">
                      {index < t.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-300 italic mb-8 leading-relaxed relative z-10 flex-1 font-medium text-lg">&quot;{t.content}&quot;</p>
                
                <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-black rounded-xl flex items-center justify-center font-black text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:scale-110 transition-transform duration-500">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-white font-black tracking-wide">{t.name}</h5>
                    <p className="text-[#D4AF37]/80 text-xs font-bold tracking-widest uppercase mt-1">Verified VIP</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.section>

`;

let testStartIndex = code.indexOf(testStart);
let testEndIndex = code.indexOf(testEnd, testStartIndex);

if (testStartIndex !== -1 && testEndIndex !== -1) {
    code = code.substring(0, testStartIndex) + newTestimonials + code.substring(testEndIndex);
    console.log("Replaced Testimonials");
} else {
    console.log("Could not find testimonials section.");
}

fs.writeFileSync('src/components/HomePage.tsx', code);
