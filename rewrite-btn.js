const fs = require('fs');
let code = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

const btnStart = `  const renderPackageBtn = (name: string, price: string, label: string, colorClass: string, badgeBgClass: string, textColorClass: string = 'text-black', subtext?: string) => (`;
const btnEnd = `  );`;

const newBtn = `  const renderPackageBtn = (name: string, price: string, label: string, colorClass: string, badgeBgClass: string, textColorClass: string = 'text-black', subtext?: string) => (
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
  );`;

let startIndex = code.indexOf(btnStart);
if (startIndex !== -1) {
    let nextReturnIndex = code.indexOf(btnEnd, startIndex);
    if (nextReturnIndex !== -1) {
        let endIndex = nextReturnIndex + btnEnd.length;
        code = code.substring(0, startIndex) + newBtn + code.substring(endIndex);
        console.log("Replaced btn");
    } else {
        console.log("Could not find btnEnd");
    }
} else {
    console.log("Could not find btnStart");
}

fs.writeFileSync('src/components/HomePage.tsx', code);
