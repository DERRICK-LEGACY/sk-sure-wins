"use client";

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageCircle, CheckCircle, Send, BellRing, X, ShoppingCart, Zap, Loader2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PaymentModal from "@/components/PaymentModal";
import BookSection from "@/components/BookSection";
import SocialSection from "@/components/SocialSection";
import Navbar from "@/components/Navbar";
import FloatingChat from "@/components/FloatingChat";
import { submitTestimonial } from "@/app/actions";
import { FreeHook, Ticket as WonTicket, Testimonial, Package } from '@prisma/client';

// Animation Variants
const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } } };

const fakeNames = ["Denis from Kampala", "Kato from Mukono", "Mukasa from Entebbe", "Ivan from Jinja", "Ssebagala from Masaka", "Ouma from Mbale"];
const fakePackages = ["Gold VIP", "Silver Odds", "Bronze Package", "Premium Offer"];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);


export default function HomePage({ freeHooks, wonTickets, testimonials = [], specialOffer }: { freeHooks: FreeHook[], wonTickets: WonTicket[], testimonials?: Testimonial[], specialOffer?: Package | null }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", price: "" });
  const [toast, setToast] = useState<{ name: string, pkg: string } | null>(null);
  const [isPackagesLoading, setIsPackagesLoading] = useState(true);

  // Simulate network request for dynamic package loading
  useEffect(() => {
    const timer = setTimeout(() => setIsPackagesLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const hardcodedReviews: Testimonial[] = [
    {
      id: "hc-1",
      name: "Ssebagala from Masaka",
      content: "Man, I was tired of losing my money to these betting companies. SK gave me that VIP odd and it actually landed without sweat. You guys are the real deal!",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "hc-2",
      name: "Kato from Mukono",
      content: "At first I thought it was just another scam because of how people steal online, but I risked with the Bronze lifechanger and recovered my rent money. Big up SK Sure Wins!",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "hc-3",
      name: "Ouma from Mbale",
      content: "I have been buying odds from many people but SK you're different. Three days straight of winning... this is crazy. God bless your hustle.",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "hc-4",
      name: "Denis from Kampala",
      content: "The SK counter attack is no joke! I paid the 350k painfully but the slip we won yesterday made me forget all the pain. Thanks boss.",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "hc-5",
      name: "Mutebi from Wakiso",
      content: "If you are doubting, just try the Silver subscription. These guys do real analysis, no guessing. I just bought a boda boda because of your tips!",
      rating: 5,
      approved: true,
      createdAt: new Date(),
    }
  ];

  const allTestimonials = [...hardcodedReviews, ...testimonials];

  // Toast logic (Social Proof)
  useEffect(() => {
    const toastTimer = setInterval(() => {
      const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const randomPkg = fakePackages[Math.floor(Math.random() * fakePackages.length)];
      setToast({ name: randomName, pkg: randomPkg });

      setTimeout(() => {
        setToast(null);
      }, 5000); // Hide after 5 seconds
    }, 14000); // Pop up every 14 seconds
    return () => clearInterval(toastTimer);
  }, []);

  const openModal = (name: string, price: string) => {
    setSelectedPackage({ name, price });
    setModalOpen(true);
  };

  const renderPackageBtn = (name: string, price: string, label: string, colorClass: string, badgeBgClass: string, textColorClass: string = 'text-black', subtext?: string) => (
    <button onClick={() => openModal(name, price)} className="relative w-full flex justify-between items-center mb-4 px-5 py-4 rounded-2xl bg-[#08080A]/60 hover:bg-[#111116] border border-white/5 hover:border-white/20 transition-all duration-300 group overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Laser line on hover */}
      <motion.div 
        className={`absolute bottom-0 left-0 h-[2px] w-0 ${badgeBgClass} group-hover:w-full transition-all duration-500 z-20`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
      
      <div className="flex flex-col text-left pr-2 relative z-10">
        <span className={`text-xs xl:text-sm font-black uppercase flex items-center gap-2 leading-tight mb-1 ${colorClass}`}>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Zap size={14} className={`shrink-0 ${colorClass}`} />
          </motion.div>
          <span className="tracking-widest">{label}</span>
        </span>
        <span className={`font-black text-white text-base xl:text-lg flex items-center gap-2 font-mono`}>
          {price} 
          {subtext && <span className="text-[10px] text-gray-500 font-medium normal-case tracking-wide bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{subtext}</span>}
        </span>
      </div>
      
      <div className={`${badgeBgClass} ${textColorClass} flex items-center justify-center w-12 h-12 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden`}>
        <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ShoppingCart size={18} className="relative z-10" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[128px] -z-10 mix-blend-screen" />



      <main className="flex-1 w-full flex flex-col items-center pb-16">

                {/* PREMIUM HERO SECTION */}
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

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-6 tracking-tighter leading-[1.05] text-white">
              PAY YOUR WAY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E3A6] to-[#B5952F]">WE DELIVER WINS</span>
            </motion.h1>

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

        {/* PREMIUM SPECIAL OFFER BANNER (If Active) */}
        {specialOffer && (
          <div className="w-full max-w-5xl mx-auto px-6 mb-16 -mt-10 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
        {/* PREMIUM SPECIAL OFFER BANNER (If Active) */}
        {specialOffer && (
          <div className="w-full max-w-4xl mx-auto px-4 mb-8 -mt-6 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-[#0b0b10]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 md:px-7 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d4af37]/35 shadow-[0_0_20px_rgba(212,175,55,0.18)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:border-[#d4af37]/60 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              
              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-[#16161f] border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-extrabold uppercase tracking-widest py-0.5 px-3 rounded-full mb-1.5">
                  🔥 LIMITED TIME OFFER
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight mb-1">
                  {specialOffer.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm font-medium">
                  Exclusive VIP Access • Instant Win • {specialOffer.durationDays} Days
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                  {specialOffer.price.toLocaleString()} UGX
                </div>
                <button 
                  onClick={() => openModal(specialOffer.name, `${Math.floor(specialOffer.price / 1000)}k`)} 
                  className="bg-gradient-to-r from-[#d4af37] to-[#f4e3a6] hover:from-[#f4e3a6] hover:to-[#d4af37] text-black font-extrabold py-2.5 px-6 rounded-xl shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 transition-all text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>BUY NOW</span>
                  <Send size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* PAGE CONTENT CONTAINER */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-6">

          {/* DAILY SPECIAL TICKET BANNER */}
          <div className="w-full max-w-4xl mx-auto mb-10 relative z-20 mt-2">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="bg-[#08121a]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 md:px-7 flex flex-col md:flex-row items-center justify-between gap-4 border border-cyan-400/35 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:border-cyan-400/60 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              
              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest py-0.5 px-3 rounded-full mb-1.5">
                  ⚡ DAILY SPECIAL
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight mb-1">
                  Daily Special Ticket
                </h3>
                <p className="text-cyan-300/80 text-xs sm:text-sm font-medium">
                  Guaranteed Wins • Expert Analysis • 24 Hours Access
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                  30,000 UGX
                </div>
                <button 
                  onClick={() => openModal("Premium: Daily Special Ticket", "30k")} 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-extrabold py-2.5 px-6 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_22px_rgba(6,182,212,0.65)] active:scale-95 transition-all text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>BUY NOW</span>
                  <Send size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* PACKAGES SECTION HEADER */}
          <div id="packages" className="w-full text-center mb-12 flex flex-col items-center pt-20 mt-[-80px]">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight text-white drop-shadow-md">SK SUBSCRIPTION <br className="md:hidden" /><span className="text-[#D4AF37] glow-text">PACKAGE</span></h2>
            <div className="inline-block bg-[#D4AF37] text-black font-extrabold px-8 py-2 rounded-full text-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] uppercase tracking-wide border-2 border-black/20 transform -rotate-2 hover:rotate-0 transition-transform">JOIN US TODAY</div>
          </div>

          {/* PACKAGES GRID */}
          {isPackagesLoading ? <PackagesSkeleton /> : (
            <>
              <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 px-4 md:px-0">
            {/* VIP TIERS */}
            {/* BRONZE */}
            <motion.div whileHover={{ y: -5 }} variants={itemVariants} className="glass-panel p-8 pt-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border border-[#cd7f32]/20 hover:border-[#cd7f32]/40 bg-[#0A0A0F]/60 backdrop-blur-md transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#cd7f32] to-[#8c5622] flex items-center justify-center text-2xl shadow-lg mb-6 text-black">🥉</div>
              <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">BRONZE VIP</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">1 Week Subscription</p>
              <div className="w-full bg-[#111116] rounded-2xl p-4 text-left border border-white/5 flex-1 space-y-1">
                {renderPackageBtn("Bronze: ODD 1.5 Lifechanger", "30k", "ODD 1.5 Lifechanger", "text-[#cd7f32]", "bg-[#cd7f32]")}
                {renderPackageBtn("Bronze: ODD 2", "20k", "ODD 2", "text-[#cd7f32]", "bg-[#cd7f32]")}
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
                {renderPackageBtn("Silver: AKATAMBULA", "50k", "AKATAMBULA", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black", "(1 Month)")}
                {renderPackageBtn("Silver: VIP", "60k", "VIP", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black")}
                {renderPackageBtn("Silver: VVIP", "70k", "VVIP", "text-[#c0c0c0]", "bg-[#c0c0c0]", "text-black")}
                {renderPackageBtn("Silver: ODD 8-10", "80k", "ODD 8-10", "text-[#c0c0c0]", "bg-[#c0c0c0]")}
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

          {/* BOTTOM PREMIUM SPLIT BANNER */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-5xl grid md:grid-cols-2 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative mb-16 mx-4 md:mx-auto group/banner z-10">

            {/* HYPER GLOW BACKGROUND */}
            <div className="absolute inset-0 bg-[#0A0A0F] z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-[#D4AF37]/20 blur-[80px] z-0 pointer-events-none transition-all duration-700 group-hover/banner:opacity-100 opacity-60"></div>

            {/* BALL ICON IN CENTER */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex w-24 h-24 bg-black/80 backdrop-blur-xl rounded-full items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden p-3 border border-[#D4AF37]/30 group-hover/banner:scale-110 transition-transform duration-700">
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
                    <button key={idx} onClick={() => openModal(pkg.name, pkg.price)} className="relative w-full flex justify-between items-center px-5 py-4 rounded-2xl bg-[#08080A]/60 hover:bg-[#111116] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group/btn overflow-hidden shadow-2xl backdrop-blur-sm">
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 group-hover/btn:w-full transition-all duration-500 z-20"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                      
                      <div className="flex flex-col text-left pr-2 relative z-10">
                        <span className="flex items-center gap-2 text-white text-xs xl:text-sm tracking-wide font-black uppercase mb-1">
                          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] shrink-0 animate-pulse"></div>
                          </motion.div>
                          <span className="truncate">{pkg.label}</span>
                        </span>
                        <span className="font-black text-blue-400 text-base xl:text-lg flex items-center gap-2 font-mono">
                          {pkg.price}
                        </span>
                      </div>
                      
                      <div className="bg-blue-500 text-white flex items-center justify-center w-12 h-12 rounded-xl group-hover/btn:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] relative z-10 overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <ShoppingCart size={18} className="relative z-10" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="z-10 flex items-center justify-between mt-auto">
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
                    { name: "Life Changer: ODD 1.30", price: "50,000", label: "ODD 1.30" },
                    { name: "Life Changer: ODD 1.50", price: "50,000", label: "ODD 1.50" }
                  ].map((pkg, idx) => (
                    <button key={idx} onClick={() => openModal(pkg.name, pkg.price)} className="relative w-full flex justify-between items-center px-5 py-4 rounded-2xl bg-[#08080A]/60 hover:bg-[#111116] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group/btn overflow-hidden shadow-2xl backdrop-blur-sm">
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D4AF37] group-hover/btn:w-full transition-all duration-500 z-20"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                      
                      <div className="flex flex-col text-left pr-2 relative z-10">
                        <span className="flex items-center gap-2 text-white text-xs xl:text-sm tracking-wide font-black uppercase mb-1">
                          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                            <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] shrink-0 animate-pulse"></div>
                          </motion.div>
                          <span className="truncate">{pkg.label}</span>
                        </span>
                        <span className="font-black text-[#D4AF37] text-base xl:text-lg flex items-center gap-2 font-mono">
                          {pkg.price}
                        </span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F9D976] text-black flex items-center justify-center w-12 h-12 rounded-xl group-hover/btn:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(212,175,55,0.6)] relative z-10 overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <ShoppingCart size={18} className="relative z-10" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="z-10 flex items-center justify-between mt-auto">
                <div className="hidden md:block text-right text-6xl text-white/5 font-light pr-8 transform scale-y-[2]">{'}'}</div>
                <div className="text-5xl font-black text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] ml-auto md:ml-0">50K</div>
              </div>
            </div>

          </motion.div>
            </>
          )}

        </div>
      </main>

      {/* RECENT TICKETS (FREE & VIP WINS) */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 text-left items-stretch">

        {/* FREE TIP SECTION */}
        <div className="flex-1 bg-gradient-to-br from-[#1a1525] to-[#0f0a14] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-[#25D366] text-black text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">Free Tip of the Day</div>
          <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Recent <span className="text-[#25D366]">Free Tips</span></h3>

          <div className="flex flex-col gap-4 flex-1">
            {freeHooks.slice(0, 2).map((hook: FreeHook) => (
              <div key={hook.id} className="bg-black/50 p-4 rounded-2xl border border-white/5 backdrop-blur flex flex-col gap-4">
                {hook.imageUrl && (
                  <Image src={hook.imageUrl} alt="Free Ticket" width={500} height={500} className="w-full h-auto rounded-xl border border-white/10 object-contain bg-black/40" />
                )}
                {hook.description && (
                  <div className="text-white text-lg font-bold">
                    {(hook.description.startsWith('http://') || hook.description.startsWith('https://')) ? (
                      <a href={hook.description} target="_blank" rel="noopener noreferrer" className="inline-block py-2 px-4 bg-[#25D366] text-black rounded-lg font-black hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(37,211,102,0.4)] break-all text-left">
                        🔗 Click here to view
                      </a>
                    ) : (
                      hook.description
                    )}
                  </div>
                )}
              </div>
            ))}
            {freeHooks.length === 0 && (
              <div className="bg-black/50 p-6 rounded-2xl border border-white/5 backdrop-blur flex items-center justify-center text-gray-500 font-bold flex-1">
                No free tips posted yet.
              </div>
            )}
          </div>

          <a href="/free-tickets" className="mt-auto pt-6 block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors">
            View All Free Tickets
          </a>
        </div>

        {/* RECENT VIP WINS PREVIEW */}
        <div className="flex-1 bg-gradient-to-br from-[#2a133d] to-[#12071a] rounded-3xl border border-primary/20 p-8 shadow-[0_15px_40px_rgba(234,179,8,0.15)] flex flex-col">
          <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Recent <span className="text-primary">VIP Wins</span></h3>

          <div className="flex flex-col gap-4 flex-1">
            {wonTickets.slice(0, 2).map((ticket: WonTicket) => (
              <div key={ticket.id} className="bg-black/60 p-4 rounded-xl border border-primary/10 flex flex-col sm:flex-row gap-4">
                {ticket.imageUrl && (
                  <Image src={ticket.imageUrl} alt="Receipt" width={500} height={500} className="w-full sm:w-24 h-24 object-contain bg-black/40 rounded-lg border border-white/10 shrink-0" />
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-white font-bold">
                    {ticket.bookingCode ? (
                      (ticket.bookingCode.startsWith('http://') || ticket.bookingCode.startsWith('https://')) ? (
                        <a href={ticket.bookingCode} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30 hover:text-[#f9d976] px-4 py-2 rounded-lg font-bold transition-all border border-[#d4af37]/30 break-all text-left text-sm md:text-base">
                          🔗 {ticket.bookingCode}
                        </a>
                      ) : (
                        ticket.bookingCode
                      )
                    ) : (
                      "WON"
                    )}
                  </div>
                </div>
              </div>
            ))}
            {wonTickets.length === 0 && (
              <div className="bg-black/30 p-6 rounded-2xl border border-white/5 flex items-center justify-center text-gray-400 font-bold flex-1">
                No winning receipts uploaded yet.
              </div>
            )}
          </div>

          <a href="/won-tickets" className="mt-auto pt-6 block text-center bg-primary hover:bg-[#d4af37] text-black font-extrabold py-3 rounded-xl transition-colors shadow-[0_5px_15px_rgba(234,179,8,0.3)]">
            View All Winning Receipts
          </a>
        </div>

      </motion.section>

      {/* BOOK SECTION */}
      <BookSection openModal={openModal} />

      {/* MEET THE EXPERT */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="w-full max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 text-left">
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent opacity-50 blur-lg rounded-3xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Image
            src="/skpic.jpeg"
            alt="SK Sure Wins Expert"
            width={800}
            height={800}
            className="relative w-full h-auto max-h-[500px] object-contain rounded-3xl border border-white/20 shadow-2xl bg-black/50"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h4 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Meet The Expert</h4>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">SK Sure <span className="text-primary">Wins</span></h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Known in the streets and online as the most reliable betting guide in Uganda. I deliver precision tips day-in and day-out. By studying team performance, market movements, and strict risk analytics, we ensure a steady win rate.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Whether you are looking for free tips or want to lock in VIP status, you are joining a family of winners. Join today and start getting receipts!
          </p>
          <a href="https://whatsapp.com/channel/0029Vb8yLOm1yT2CHUu2k70o" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#168940] text-black font-extrabold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.5)] border border-white/20">
            <div className="bg-white p-2 rounded-full shadow-md">
              <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
            </div>
            Join VIP on WhatsApp
          </a>
        </div>
      </motion.section>

      {/* TESTIMONIALS SECTION */}
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

      {/* SOCIAL MEDIA SECTION */}
      <SocialSection />

      {/* FOOTER */}
      <footer className="w-full py-16 border-t border-white/5 bg-[#0f0a14] mt-20 relative overflow-hidden z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center">

            {/* Column 1: Brand */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Image src="/sklogo.jpeg" alt="Logo" width={100} height={100} className="w-12 h-12 rounded-lg object-contain bg-black border border-white/10 shadow-lg" />
                <h2 className="text-2xl font-black text-white tracking-tight">SK Sure <span className="text-primary">Wins</span></h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                Uganda&apos;s most trusted sports betting tipster. Join the winning team today and turn your stakes into massive profits.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/vip-dashboard" className="hover:text-primary transition-colors">VIP Dashboard</Link></li>
                <li><a href="https://whatsapp.com/channel/0029Vb8yLOm1yT2CHUu2k70o" target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">WhatsApp Channel</a></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            {/* Column 3: Socials */}
            <div className="flex flex-col items-center">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Connect With Us</h3>
              <div className="flex items-center gap-4">
                <a href="https://whatsapp.com/channel/0029Vb8yLOm1yT2CHUu2k70o" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all border border-white/10 shadow-lg hover:shadow-[#25D366]/20 hover:-translate-y-1">
                  <MessageCircle size={22} />
                </a>
                <a href="https://www.tiktok.com/@sk_surewins_officialpage" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all border border-white/10 shadow-lg hover:-translate-y-1">
                  <svg viewBox="0 0 448 512" className="w-5 h-5 fill-current"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" /></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} SK Sure Wins. All rights reserved.</p>
            <p>Disclaimer: Sports betting involves financial risk. Please gamble responsibly.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING CHAT WIDGET */}
      <FloatingChat />

      {/* LIVE PURCHASE TOAST (SOCIAL PROOF) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: 50 }}
            className="fixed bottom-6 left-6 z-50 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 w-72"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
              <BellRing size={20} className="text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-white text-sm m-0 leading-tight">🔥 <b>{toast.name}</b></p>
              <p className="text-gray-400 text-xs m-0 leading-tight mt-1">just purchased <span className="text-primary font-bold">{toast.pkg}</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL MOUNT */}
      <PaymentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} packageName={selectedPackage.name} price={selectedPackage.price} />
      <TestimonialModal isOpen={testModalOpen} onClose={() => setTestModalOpen(false)} />
    </div>
  );
}

function TestimonialModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.append("rating", rating.toString());
    const result = await submitTestimonial(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1a1525] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><X size={20} /></button>
        <h2 className="text-2xl font-black text-white mb-2">Share Your Win</h2>
        <p className="text-gray-400 text-sm mb-6">Share your winning journey with others!</p>

        {success ? (
          <div className="py-12 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-[#25D366] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Review Submitted!</h3>
            <p className="text-gray-400">Thank you for sharing your experience.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg font-bold">{error}</div>}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
              <input name="name" type="text" required placeholder="e.g. John from Kampala" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rating</label>
              <div className="flex gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)} className={star <= rating ? "text-primary" : "text-white/10 hover:text-primary/50"}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Review</label>
              <textarea name="content" required minLength={10} placeholder="Tell us about your experience and your winnings..." className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-primary outline-none transition-all min-h-[120px]" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#25D366] text-black font-black py-3 rounded-xl hover:bg-[#1fad53] transition-colors disabled:opacity-50 text-lg flex items-center justify-center gap-2">
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setTimeout(() => setCount(end), 0);
      return;
    }
    const totalDuration = 2000;
    const incrementTime = (totalDuration / end);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
}

function PackagesSkeleton() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Skeleton Header */}
      <div className="w-full text-center mb-12 flex flex-col items-center pt-20 mt-[-80px]">
        <div className="h-12 w-64 bg-white/5 rounded-xl mb-4 animate-pulse"></div>
        <div className="h-10 w-48 bg-[#D4AF37]/20 rounded-full animate-pulse border border-[#D4AF37]/10"></div>
      </div>
      
      {/* Skeleton Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 px-4 md:px-0 max-w-6xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel p-8 pt-12 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="w-12 h-12 bg-white/5 rounded-full mb-8 animate-pulse"></div>
            <div className="h-8 w-32 bg-white/10 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 w-24 bg-white/5 rounded-md mb-6 animate-pulse"></div>
            <div className="w-full bg-black/40 rounded-2xl p-3 mb-4 space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-14 w-full bg-white/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Split Banner */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 mb-16 mx-4 md:mx-auto">
        <div className="bg-[#111116] p-8 md:p-12 flex flex-col border-b md:border-b-0 md:border-r border-white/5">
          <div className="h-8 w-40 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-4 w-32 bg-white/5 rounded-md mb-8 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-14 w-full bg-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-[#111116] p-8 md:p-12 flex flex-col">
          <div className="h-8 w-40 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-4 w-32 bg-white/5 rounded-md mb-8 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-14 w-full bg-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
