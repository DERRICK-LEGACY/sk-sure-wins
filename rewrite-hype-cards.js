const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// Replace renderPackageBtn
const btnStart = 'const renderPackageBtn = (name: string, price: string, label: string, colorClass: string, badgeBgClass: string, textColorClass: string = \\\'text-black\\\', subtext?: string) => (';
const btnEnd = '  return (';
const newBtn = `const renderPackageBtn = (name: string, price: string, label: string, colorClass: string, badgeBgClass: string, textColorClass: string = 'text-black', subtext?: string) => (
    <button onClick={() => openModal(name, price)} className="relative w-full flex justify-between items-center mb-4 px-5 py-4 rounded-2xl bg-[#08080A]/60 hover:bg-[#111116] border border-white/5 hover:border-white/20 transition-all duration-300 group overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Laser line on hover */}
      <motion.div 
        className={\`absolute bottom-0 left-0 h-[2px] w-0 \${badgeBgClass} group-hover:w-full transition-all duration-500 z-20\`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
      
      <div className="flex flex-col text-left pr-2 relative z-10">
        <span className={\`text-xs xl:text-sm font-black uppercase flex items-center gap-2 leading-tight mb-1 \${colorClass}\`}>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Zap size={14} className={\`shrink-0 \${colorClass}\`} />
          </motion.div>
          <span className="tracking-widest">{label}</span>
        </span>
        <span className={\`font-black text-white text-base xl:text-lg flex items-center gap-2 font-mono\`}>
          {price} 
          {subtext && <span className="text-[10px] text-gray-500 font-medium normal-case tracking-wide bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{subtext}</span>}
        </span>
      </div>
      
      <div className={\`\${badgeBgClass} \${textColorClass} flex items-center justify-center w-12 h-12 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden\`}>
        <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ShoppingCart size={18} className="relative z-10" />
      </div>
    </button>
  );

  `;
code = code.substring(0, code.indexOf(btnStart)) + newBtn + code.substring(code.indexOf(btnEnd));

// Replace the VIP Tiers
const tierStart = '{/* VIP TIERS */}';
const tierEnd = '{/* BOTTOM PREMIUM SPLIT BANNER */}';
const newTiers = `{/* ADVANCED HYPE VIP TIERS */}
            {/* BRONZE */}
            <motion.div whileHover={{ y: -10 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#cd7f32]/20 hover:border-[#cd7f32]/50 bg-[#0A0A0F]/80 backdrop-blur-xl transition-all duration-500">
              <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-[#cd7f32] blur-[80px] pointer-events-none rounded-full" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#cd7f32] to-[#593514] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(205,127,50,0.4)] mb-8 text-black relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute -inset-2 border border-[#cd7f32]/30 rounded-full border-t-[#cd7f32]" />
                🥉
              </div>
              <h3 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-1 drop-shadow-md">BRONZE VIP</h3>
              <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-8 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">2 Weeks Access</p>
              <div className="w-full bg-[#111116]/80 rounded-2xl p-4 text-left border border-[#cd7f32]/10 flex-1 space-y-1 relative z-10 shadow-inner">
                {renderPackageBtn("Bronze: ODD 1.5 Normal", "10k", "ODD 1.5 Normal", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 2", "20k", "ODD 2", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 1.5 Lifechanger", "30k", "ODD 1.5 Lifechanger", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 3", "30k", "ODD 3", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 4", "40k", "ODD 4", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 5", "50k", "ODD 5", "text-[#cd7f32]", "bg-[#cd7f32]")}
              </div>
            </motion.div>

            {/* SILVER */}
            <motion.div whileHover={{ y: -10 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#c0c0c0]/30 hover:border-[#c0c0c0]/60 bg-[#0A0A0F]/80 backdrop-blur-xl transition-all duration-500 shadow-2xl relative">
              <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-[#c0c0c0] blur-[80px] pointer-events-none rounded-full" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffffff] to-[#505050] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(192,192,192,0.4)] mb-8 text-black relative">
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute -inset-2 border border-[#c0c0c0]/40 rounded-full border-b-[#c0c0c0]" />
                🥈
              </div>
              <h3 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-1 drop-shadow-md">SILVER VIP</h3>
              <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-8 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">2 Weeks Access</p>
              <div className="w-full bg-[#111116]/80 rounded-2xl p-4 text-left border border-[#c0c0c0]/10 flex-1 space-y-1 relative z-10 shadow-inner">
                {renderPackageBtn("Silver: VIP", "50k", "VIP", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black")}
                {renderPackageBtn("Silver: AKATAMBULA", "50k", "AKATAMBULA", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black", "(1 Month)")}
                {renderPackageBtn("Silver: ODD 8-10", "60k", "ODD 8-10", "text-[#c0c0c0]", "bg-[#c0c0c0]")}
                {renderPackageBtn("Silver: VVIP", "70k", "VVIP", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black")}
                {renderPackageBtn("Silver: ODD 20", "100k", "ODD 20", "text-[#c0c0c0]", "bg-[#c0c0c0]")}
              </div>
            </motion.div>

            {/* GOLD */}
            <motion.div whileHover={{ y: -10 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#d4af37]/60 hover:border-[#d4af37] bg-[#111116]/90 backdrop-blur-2xl transition-all duration-500 shadow-[0_30px_60px_rgba(212,175,55,0.15)] md:scale-105 z-20">
              <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5 pointer-events-none rounded-3xl" />
              <div className="absolute top-5 -right-12 bg-gradient-to-r from-[#d4af37] to-[#F4E3A6] text-black text-[9px] font-black tracking-[0.3em] py-1.5 px-14 transform rotate-45 shadow-[0_0_20px_rgba(212,175,55,0.6)]">
                MASTER
              </div>
              
              {/* Spinning Rings around Gold Icon */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFF8D6] to-[#a3801f] flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(212,175,55,0.6)] mb-8 text-black relative z-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute -inset-3 border border-[#d4af37]/50 rounded-full border-t-[#d4af37] border-l-[#d4af37]" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute -inset-[22px] border border-[#d4af37]/20 rounded-full border-b-[#FFF8D6]" />
                👑
              </div>
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8D6] to-[#D4AF37] tracking-[0.2em] uppercase mb-1 drop-shadow-xl">GOLD VIP</h3>
              <p className="text-[#d4af37] text-[10px] font-mono uppercase tracking-[0.3em] mb-8 bg-[#d4af37]/10 px-4 py-1.5 rounded-full border border-[#d4af37]/20 shadow-[0_0_10px_rgba(212,175,55,0.2)]">Monthly Access</p>
              
              <div className="w-full bg-[#1A1A24]/90 rounded-2xl p-4 text-left border border-[#d4af37]/20 flex-1 space-y-1 relative z-10 shadow-inner">
                {renderPackageBtn("Gold: Akatafa/Akatemu", "50k", "Akatafa/Akatemu", "text-[#d4af37]", "bg-[#d4af37]", "text-black")}
                {renderPackageBtn("Gold: FAMILY", "80k", "FAMILY", "text-[#d4af37]", "bg-[#d4af37]", "text-black")}
                {renderPackageBtn("Gold: BIG STAKERS", "100k", "BIG STAKERS", "text-[#d4af37]", "bg-[#d4af37]", "text-black")}
                {renderPackageBtn("Gold: ALL PACKAGES", "300k", "ALL PACKAGES", "text-[#d4af37]", "bg-[#d4af37]", "text-black")}
                {renderPackageBtn("Gold: SK Counter Attack", "350k", "SK Counter Attack", "text-[#d4af37]", "bg-[#d4af37]", "text-black")}
                {renderPackageBtn("Gold: Account Management", "500k", "Account Management", "text-[#d4af37]", "bg-[#d4af37]", "text-black")}
              </div>
            </motion.div>
          </motion.div>

          `;
code = code.substring(0, code.indexOf(tierStart)) + newTiers + code.substring(code.indexOf(tierEnd));

fs.writeFileSync('src/components/HomePage.tsx', code);
