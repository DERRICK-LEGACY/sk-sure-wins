"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageCircle, Clock, Lock, CheckCircle, Trophy, Send, BellRing, X } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";
import Navbar from "@/components/Navbar";
import { submitTestimonial } from "@/app/actions";

// Animation Variants
const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } } };

const fakeNames = ["Denis from Kampala", "Kato from Mukono", "Mukasa from Entebbe", "Ivan from Jinja", "Ssebagala from Masaka", "Ouma from Mbale"];
const fakePackages = ["Gold VIP", "Silver Odds", "Bronze Package", "Premium Offer"];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function HomePage({ freeHooks, wonTickets, testimonials = [] }: { freeHooks: any[], wonTickets: any[], testimonials?: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", price: "" });
  const [toast, setToast] = useState<{name: string, pkg: string} | null>(null);
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

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[128px] -z-10 mix-blend-screen" />

      {/* TOP BANNER */}
      <div className="w-full bg-primary text-black font-bold text-sm py-2 overflow-hidden relative mt-[88px] whitespace-nowrap">
        <div className="marquee-track flex gap-12">
          {[0, 1].map(copy => (
            <div key={copy} className="marquee-content flex gap-12 shrink-0">
              {wonTickets.length > 0 ? (
                wonTickets.map((ticket: any, i: number) => (
                  <span key={i}>🔥 {ticket.description} 🔥</span>
                ))
              ) : (
                <>
                  <span>🔥 YESTERDAY'S VIP TICKET WON: 4.5M UGX PAID OUT! 🔥</span>
                  <span>✅ BRONZE TICKET WON ✅</span>
                  <span>💸 JOIN THE WINNING TEAM TODAY 💸</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 w-full flex flex-col items-center pb-16">
        
        {/* HERO SECTION WITH VIDEO BACKGROUND */}
        <section className="relative w-full flex flex-col items-center justify-center py-28 px-6 text-center overflow-hidden min-h-[85vh]">
          {/* VIDEO BACKGROUND */}
          <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* LIGHT OVERLAY */}
          <div className="absolute inset-0 bg-black/70 z-0"></div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto mt-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-accent text-xs font-bold tracking-widest mb-8 uppercase shadow-lg shadow-accent/10">
              Uganda's Most Trusted Tipster
            </motion.div>
            
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-tight text-white drop-shadow-2xl">
              Pay Your Way, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-primary-dark">We Deliver Wins.</span>
            </motion.h2>

            {/* JOIN WHATSAPP FUNNEL */}
            <motion.a 
              href="https://whatsapp.com/channel/0029Vb74ody59PwPUG2F8G1h" 
              target="_blank"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 mb-8 w-full max-w-md flex items-center justify-center gap-4 bg-gradient-to-r from-[#25D366] to-[#1da851] text-black font-extrabold py-5 px-6 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.6)] border border-white/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 blur-md group-hover:opacity-100 opacity-0 transition-opacity"></div>
              <div className="bg-white p-2.5 rounded-full shadow-lg relative z-10 flex items-center justify-center">
                <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
              </div>
              <span className="text-lg sm:text-xl tracking-tight relative z-10">Join Our Free WhatsApp</span>
            </motion.a>
          </div>
        </section>

        {/* PAGE CONTENT CONTAINER */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-6">

        {/* STATS SECTION */}
        <section className="w-full max-w-5xl py-12 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="flex flex-col items-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2"><AnimatedNumber value={95} suffix="%" /></h3>
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400">Win Rate</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2"><AnimatedNumber value={50} suffix="k+" /></h3>
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400">Happy Subscribers</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2"><AnimatedNumber value={5} suffix="+" /></h3>
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400">Years Active</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-2"><AnimatedNumber value={100} suffix="%" /></h3>
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400">Daily Winning Tickets</p>
            </div>
          </div>
        </section>

        {/* MEET THE EXPERT */}
        <section className="w-full max-w-5xl py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 text-left">
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent opacity-50 blur-lg rounded-3xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/skpic.jpeg" 
              alt="SK Sure Wins Expert" 
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
            <a href="https://whatsapp.com/channel/0029Vb74ody59PwPUG2F8G1h" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#168940] text-black font-extrabold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.5)] border border-white/20">
              <div className="bg-white p-2 rounded-full shadow-md">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              Join VIP on WhatsApp
            </a>
          </div>
        </section>

        {/* RECENT TICKETS (FREE & VIP WINS) */}
        <section className="w-full max-w-6xl py-12 flex flex-col md:flex-row gap-8 text-left items-stretch">
          
          {/* FREE TIP SECTION */}
          <div className="flex-1 bg-gradient-to-br from-[#1a1525] to-[#0f0a14] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 bg-[#25D366] text-black text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">Free Tip of the Day</div>
            <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Recent <span className="text-[#25D366]">Free Tips</span></h3>
            
            <div className="flex flex-col gap-4 flex-1">
              {freeHooks.slice(0, 2).map((hook: any) => (
                <div key={hook.id} className="bg-black/50 p-4 rounded-2xl border border-white/5 backdrop-blur flex flex-col gap-4">
                  {hook.image_url && (
                    <img src={hook.image_url} alt="Free Ticket" className="w-full h-auto rounded-xl border border-white/10 object-cover" />
                  )}
                  {hook.description && (
                    <div className="text-white text-lg font-bold">
                      {hook.description}
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
            
            <a href="/free-tickets" className="mt-6 block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors">
              View All Free Tickets
            </a>
          </div>

          {/* RECENT VIP WINS PREVIEW */}
          <div className="flex-1 bg-gradient-to-br from-[#2a133d] to-[#12071a] rounded-3xl border border-primary/20 p-8 shadow-[0_15px_40px_rgba(234,179,8,0.15)] flex flex-col">
            <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Recent <span className="text-primary">VIP Wins</span></h3>
            
            <div className="flex flex-col gap-4 flex-1">
              {wonTickets.slice(-2).reverse().map((ticket: any) => (
                <div key={ticket.id} className="bg-black/60 p-4 rounded-xl border border-primary/10 flex flex-col sm:flex-row gap-4">
                  {ticket.image_url && (
                    <img src={ticket.image_url} alt="Receipt" className="w-full sm:w-24 h-24 object-cover rounded-lg border border-white/10 shrink-0" />
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-white font-bold">{ticket.description}</div>
                  </div>
                </div>
              ))}
              {wonTickets.length === 0 && (
                <div className="text-gray-400 font-bold text-center p-8 bg-black/30 rounded-xl border border-white/5">
                  No winning receipts uploaded yet.
                </div>
              )}
            </div>

            <a href="/won-tickets" className="mt-6 block text-center bg-primary hover:bg-[#d4af37] text-black font-extrabold py-3 rounded-xl transition-colors shadow-[0_5px_15px_rgba(234,179,8,0.3)]">
              View All Winning Receipts
            </a>
          </div>
          
        </section>
        {/* PACKAGES SECTION HEADER */}
        <div id="packages" className="w-full text-center mb-12 flex flex-col items-center pt-20 mt-[-80px]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight text-white drop-shadow-md">MUNAKAPAPULA <br className="md:hidden" /><span className="text-primary-dark">MATCHDAY PACKAGES</span></h2>
          <div className="inline-block bg-primary text-black font-extrabold px-8 py-2 rounded-full text-xl sm:text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)] uppercase tracking-wide border-2 border-black/20 transform -rotate-2 hover:rotate-0 transition-transform">JOIN US TODAY</div>
        </div>

        {/* PACKAGES GRID */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {/* BRONZE */}
          <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 pt-10 sm:pt-12 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group hover:border-[#cd7f32]/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(205,127,50,0.15)] bg-gradient-to-b from-[#cd7f32]/10 to-transparent">
            {/* Bronze Medal */}
            <div className="absolute top-0 w-8 h-12 bg-gradient-to-b from-[#cd7f32] to-[#8c5622] flex justify-center shadow-lg"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#eeb98c] to-[#cd7f32] border-[6px] border-white/10 absolute -bottom-8 flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]"></div></div>
            <div className="mt-6 mb-4 w-full bg-[#cd7f32]/20 py-2 rounded-xl border border-[#cd7f32]/30"><h3 className="text-2xl font-black text-[#cd7f32] tracking-wider uppercase">BRONZE ODDS</h3></div>
            <p className="text-sm text-gray-300 mb-6 font-bold uppercase tracking-wider">1 Week Subscription</p>
            <div className="w-full bg-black/40 rounded-2xl p-3 mb-4 text-left border border-white/5 backdrop-blur-md flex-1">
              <button onClick={() => openModal("Bronze: ODD 1.5 Normal", "10,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#cd7f32] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 1.5 Normal</span><span className="font-black text-white text-lg">10k</span>
              </button>
              <button onClick={() => openModal("Bronze: ODD 1.2", "20,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#cd7f32] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 1.2</span><span className="font-black text-white text-lg">20k</span>
              </button>
              <button onClick={() => openModal("Bronze: ODD 3", "30,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#cd7f32] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 3</span><span className="font-black text-white text-lg">30k</span>
              </button>
              <button onClick={() => openModal("Bronze: ODD 4", "40,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#cd7f32] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 4</span><span className="font-black text-white text-lg">40k</span>
              </button>
              <button onClick={() => openModal("Bronze: ODD 5", "50,000")} className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#cd7f32] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 5</span><span className="font-black text-white text-lg">50k</span>
              </button>
            </div>
          </motion.div>

          {/* SILVER */}
          <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 pt-10 sm:pt-12 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group hover:border-[#c0c0c0]/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(192,192,192,0.15)] bg-gradient-to-b from-[#c0c0c0]/10 to-transparent">
            {/* Silver Medal */}
            <div className="absolute top-0 w-8 h-12 bg-gradient-to-b from-[#c0c0c0] to-[#808080] flex justify-center shadow-lg"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffffff] to-[#c0c0c0] border-[6px] border-white/10 absolute -bottom-8 flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]"></div></div>
            <div className="mt-6 mb-4 w-full bg-[#c0c0c0]/20 py-2 rounded-xl border border-[#c0c0c0]/30"><h3 className="text-2xl font-black text-[#c0c0c0] tracking-wider uppercase">SILVER ODDS</h3></div>
            <p className="text-sm text-gray-300 mb-6 font-bold uppercase tracking-wider">1 Week Subscription</p>
            <div className="w-full bg-black/40 rounded-2xl p-3 mb-4 text-left border border-white/5 backdrop-blur-md flex-1">
              <button onClick={() => openModal("Silver: ODD 8-10", "60,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#c0c0c0] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 8-10</span><span className="font-black text-white text-lg">60k</span>
              </button>
              <button onClick={() => openModal("Silver: PROBLEM SOLVER", "70,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#c0c0c0] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> PROBLEM SOLVER</span><span className="font-black text-white text-lg">70k</span>
              </button>
              <button onClick={() => openModal("Silver: ODD 20", "100,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-[#c0c0c0] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> ODD 20</span><span className="font-black text-white text-lg">100k</span>
              </button>
              <button onClick={() => openModal("Silver: AKATAMBULA", "50,000")} className="w-full flex justify-between items-start p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 mt-1 group-hover/btn:text-white"><Send size={14} className="text-[#c0c0c0] opacity-0 group-hover/btn:opacity-100 transition-opacity" /> AKATAMBULA</span><span className="font-black text-white text-lg flex flex-col items-end">50k <span className="text-[10px] text-gray-400 font-normal normal-case block -mt-1">(1 Month)</span></span>
              </button>
            </div>
          </motion.div>

          {/* GOLD */}
          <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 pt-10 sm:pt-12 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group border-primary/40 shadow-[0_15px_50px_rgba(234,179,8,0.2)] hover:border-primary transition-all duration-300 scale-100 md:scale-105 z-10 bg-gradient-to-b from-primary/10 to-transparent">
            {/* Gold Medal */}
            <div className="absolute top-0 w-10 h-14 bg-gradient-to-b from-primary to-[#d4af37] flex justify-center shadow-lg"><div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffef96] to-primary border-[6px] border-white/10 absolute -bottom-10 flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]"></div></div>
            <div className="mt-8 mb-4 w-full bg-primary/20 py-2 rounded-xl border border-primary/30"><h3 className="text-2xl font-black text-primary tracking-wider uppercase">GOLD ODDS</h3></div>
            <p className="text-sm text-gray-300 mb-6 font-bold uppercase tracking-wider">1 Week Subscription</p>
            <div className="w-full bg-black/60 rounded-2xl p-3 mb-4 text-left border border-primary/20 backdrop-blur-md flex-1">
              <button onClick={() => openModal("Gold: VIP", "50,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-200 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" /> VIP</span><span className="font-black text-primary text-lg">50k</span>
              </button>
              <button onClick={() => openModal("Gold: VVIP", "60,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-200 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" /> VVIP</span><span className="font-black text-primary text-lg">60k</span>
              </button>
              <button onClick={() => openModal("Gold: FAMILY", "80,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-200 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" /> FAMILY</span><span className="font-black text-primary text-lg">80k</span>
              </button>
              <button onClick={() => openModal("Gold: BIG STAKERS", "100,000")} className="w-full flex justify-between items-center mb-1 p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-gray-200 uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" /> BIG STAKERS</span><span className="font-black text-primary text-lg">100k</span>
              </button>
              <button onClick={() => openModal("Gold: SERIOUS BETTORS", "300,000")} className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-white/10 transition-colors group/btn">
                <span className="text-sm font-bold text-accent uppercase flex items-center gap-2 group-hover/btn:text-white"><Send size={14} className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" /> SERIOUS BETTORS</span><span className="font-black text-accent text-xl">300k</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM PREMIUM SPLIT BANNER */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative mb-16">
          
          {/* BALL ICON IN CENTER */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex w-28 h-28 bg-white rounded-full items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden p-1 border border-white/20">
            <svg viewBox="0 0 512 512" className="w-full h-full text-black fill-current"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM130.3 358L205 283.4 121.7 200l-63 87.2c16 31.7 39.8 59 69 79.1l2.5-8.2zm112.5-98.8L168.1 184.4l49.8-96c12-3.2 24.9-5.1 38.1-5.1 14.8 0 29.2 2.3 42.9 6.4l43.8 91.5-99.9 78zm138.8 80l-85.1 53-83.3-88.6 98.7-77 69.7 112.5zm19.6-32.9L334 198.5l90.3-81c25 21.6 44.5 49.3 56.4 81l-79.6 107.8zm-153.3 121L149 365l-6.2 20.3c31.6 20.8 69.3 33 109.4 34.6l-4.4-92.6z"/></svg>
          </div>

          {/* LEFT SIDE - PREMIUM OFFER */}
          <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-8 md:p-12 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-transparent"></div>
            <div className="z-10 mb-8 flex-1">
              <h3 className="text-white text-3xl font-black uppercase tracking-widest border-b border-white/20 pb-4 mb-6 text-center md:text-left">PREMIUM OFFER</h3>
              <div className="space-y-2 text-lg font-bold text-gray-200">
                <button onClick={() => openModal("Premium: Rent Project", "40,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div> Rent Project</span>
                  <span className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
                <button onClick={() => openModal("Premium: Boda boda Project", "40,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div> Boda boda Project</span>
                  <span className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
                <button onClick={() => openModal("Premium: Back to school Project", "40,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div> Back to school Project</span>
                  <span className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
                <button onClick={() => openModal("Premium: 1M in 5 days", "40,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div> 1M in 5 days</span>
                  <span className="text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
              </div>
            </div>
            <div className="z-10 flex items-center justify-between">
              <div className="hidden md:block text-right text-6xl text-white/10 font-light pr-8 transform scale-y-[2]">{'}'}</div>
              <div className="text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] ml-auto md:ml-0">40K</div>
            </div>
          </div>

          {/* RIGHT SIDE - LIFE CHANGER */}
          <div className="bg-gradient-to-br from-primary via-[#eab308] to-[#d4af37] p-8 md:p-12 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-transparent"></div>
            <div className="z-10 mb-8 flex-1">
              <h3 className="text-black text-3xl font-black uppercase tracking-widest border-b border-black/20 pb-4 mb-6 text-center md:text-left">LIFE CHANGER</h3>
              <div className="space-y-2 text-lg font-black text-black/80 md:pl-6">
                <button onClick={() => openModal("Life Changer: ODD 1.20", "30,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div> ODD 1.20</span>
                  <span className="text-black opacity-0 group-hover/btn:opacity-100 transition-opacity bg-white/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
                <button onClick={() => openModal("Life Changer: ODD 1.30", "30,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div> ODD 1.30</span>
                  <span className="text-black opacity-0 group-hover/btn:opacity-100 transition-opacity bg-white/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
                <button onClick={() => openModal("Life Changer: ODD 1.50", "30,000")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors group/btn text-left">
                  <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div> ODD 1.50</span>
                  <span className="text-black opacity-0 group-hover/btn:opacity-100 transition-opacity bg-white/40 px-3 py-1 rounded-md text-sm">BUY</span>
                </button>
              </div>
            </div>
            <div className="z-10 flex items-center justify-between mt-auto">
              <div className="hidden md:block text-right text-6xl text-black/10 font-light pr-8 transform scale-y-[2]">{'}'}</div>
              <div className="text-5xl font-black text-black drop-shadow-[0_2px_5px_rgba(0,0,0,0.2)] ml-auto md:ml-0">30K</div>
            </div>
          </div>

        </motion.div>

        </div>
      </main>

      {/* TESTIMONIALS SECTION */}
      <section className="w-full max-w-6xl mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h4 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">What Our VIPs Say</h4>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Real Winners. <span className="text-primary">Real Results.</span></h2>
          </div>
          <button onClick={() => setTestModalOpen(true)} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg">
            Write a Review
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#1a1525] rounded-3xl border border-white/5">
              <p className="text-gray-400">No testimonials yet. Be the first to share your winning story!</p>
            </div>
          ) : (
            testimonials.map((t, i) => (
              <div key={t.id || i} className="bg-gradient-to-b from-[#1a1525] to-[#0f0a14] p-8 rounded-3xl border border-white/5 shadow-xl relative group">
                <div className="absolute top-0 right-8 w-16 h-16 bg-primary blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="flex text-primary mb-4 text-xl">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary border border-primary/30">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">{t.name}</h5>
                    <p className="text-gray-500 text-xs">VIP Member</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-16 border-t border-white/5 bg-[#0f0a14] mt-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
            
            {/* Column 1: Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-6">
                <img src="/sklogo.jpeg" alt="Logo" className="w-12 h-12 rounded-lg object-contain bg-black border border-white/10 shadow-lg" />
                <h2 className="text-2xl font-black text-white tracking-tight">SK Sure <span className="text-primary">Wins</span></h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Uganda's most trusted sports betting tipster. Join the winning team today and turn your stakes into massive profits.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="/vip-dashboard" className="hover:text-primary transition-colors">VIP Dashboard</a></li>
                <li><a href="https://whatsapp.com/channel/0029Vb74ody59PwPUG2F8G1h" target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">WhatsApp Channel</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Admin Portal</a></li>
              </ul>
            </div>

            {/* Column 3: Socials */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Connect With Us</h3>
              <div className="flex items-center gap-4">
                <a href="https://whatsapp.com/channel/0029Vb74ody59PwPUG2F8G1h" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all border border-white/10 shadow-lg hover:shadow-[#25D366]/20 hover:-translate-y-1">
                  <MessageCircle size={22} />
                </a>
                <a href="https://www.tiktok.com/@sk_surewins_officialpage" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all border border-white/10 shadow-lg hover:-translate-y-1">
                  <svg viewBox="0 0 448 512" className="w-5 h-5 fill-current"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} SK Sure Wins. All rights reserved.</p>
            <p>Disclaimer: Sports betting involves financial risk. Please gamble responsibly.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a href="https://wa.me/256703743057" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform flex items-center justify-center group">
        <WhatsAppIcon className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Chat with VIP Support</span>
      </a>

      {/* LIVE PURCHASE TOAST (SOCIAL PROOF) */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: 50 }}
            className="fixed bottom-6 left-6 z-50 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 w-72 max-w-[calc(100vw-3rem)]"
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
        <p className="text-gray-400 text-sm mb-6">Your review will be verified by the admin before appearing on the site.</p>
        
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
                {[1,2,3,4,5].map(star => (
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
      setCount(end);
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
