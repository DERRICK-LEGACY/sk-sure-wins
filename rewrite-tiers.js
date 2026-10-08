const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// Replace Bronze, Silver, Gold block
const tierStart = '{/* BRONZE */}';
const tierEnd = '{/* BOTTOM PREMIUM SPLIT BANNER */}';
const newTiers = `{/* VIP TIERS */}
            {/* BRONZE */}
            <motion.div whileHover={{ y: -5 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#cd7f32]/20 hover:border-[#cd7f32]/40 bg-[#0A0A0F]/60 backdrop-blur-md transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#cd7f32] to-[#8c5622] flex items-center justify-center text-2xl shadow-lg mb-6 text-black">🥉</div>
              <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">BRONZE VIP</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">2 Weeks Subscription</p>
              <div className="w-full bg-[#111116] rounded-2xl p-4 text-left border border-white/5 flex-1 space-y-1">
                {renderPackageBtn("Bronze: ODD 1.5 Normal", "10k", "ODD 1.5 Normal", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 2", "20k", "ODD 2", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 1.5 Lifechanger", "30k", "ODD 1.5 Lifechanger", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 3", "30k", "ODD 3", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 4", "40k", "ODD 4", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 5", "50k", "ODD 5", "text-[#cd7f32]", "bg-[#cd7f32]")}
              </div>
            </motion.div>

            {/* SILVER */}
            <motion.div whileHover={{ y: -5 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#c0c0c0]/30 hover:border-[#c0c0c0]/50 bg-[#0A0A0F]/80 backdrop-blur-md transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffffff] to-[#808080] flex items-center justify-center text-2xl shadow-lg mb-6 text-black">🥈</div>
              <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">SILVER VIP</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">2 Weeks Subscription</p>
              <div className="w-full bg-[#111116] rounded-2xl p-4 text-left border border-white/5 flex-1 space-y-1">
                {renderPackageBtn("Silver: VIP", "50k", "VIP", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black")}
                {renderPackageBtn("Silver: AKATAMBULA", "50k", "AKATAMBULA", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black", "(1 Month)")}
                {renderPackageBtn("Silver: ODD 8-10", "60k", "ODD 8-10", "text-[#c0c0c0]", "bg-[#c0c0c0]")}
                {renderPackageBtn("Silver: VVIP", "70k", "VVIP", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black")}
                {renderPackageBtn("Silver: ODD 20", "100k", "ODD 20", "text-[#c0c0c0]", "bg-[#c0c0c0]")}
              </div>
            </motion.div>

            {/* GOLD */}
            <motion.div whileHover={{ y: -5 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#d4af37]/50 hover:border-[#d4af37]/80 bg-[#111116] backdrop-blur-md transition-all duration-300 shadow-2xl md:scale-[1.02] z-10">
              <div className="absolute top-5 -right-12 bg-[#d4af37] text-black text-[9px] font-black tracking-widest py-1 px-12 transform rotate-45 shadow-lg">
                EXCLUSIVE
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFF8D6] to-[#d4af37] flex items-center justify-center text-2xl shadow-lg mb-6 text-black">👑</div>
              <h3 className="text-2xl font-black text-[#d4af37] tracking-widest uppercase mb-1">GOLD VIP</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">Monthly Subscription</p>
              <div className="w-full bg-[#1A1A24] rounded-2xl p-4 text-left border border-[#d4af37]/10 flex-1 space-y-1">
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
