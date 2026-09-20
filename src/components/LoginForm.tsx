"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyVipLogin } from "@/app/actions";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Forgot PIN state
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (phone.length < 10) throw new Error("Please enter a valid 10-digit phone number (e.g., 077... or 075...).");
      if (pin.length < 4) throw new Error("Please enter your 4-digit PIN.");

      const res = await verifyVipLogin(phone, pin);
      if (!res.success) {
        throw new Error(res.error);
      }

      router.push("/vip-dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass-panel p-8 md:p-10 rounded-[2.5rem] relative z-10"
      >
        <div className="text-center mb-8 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full animate-ping opacity-20"></div>
            <LockKeyhole className="text-[#D4AF37]" size={36} strokeWidth={1.5} />
          </motion.div>
          
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">VIP Portal</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-[#D4AF37]/80 bg-[#D4AF37]/5 w-max mx-auto px-3 py-1 rounded-full border border-[#D4AF37]/10">
            <ShieldCheck size={14} />
            <span className="font-medium tracking-wide">End-to-End Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="flex bg-[#0a0a0a]/50 border border-[#D4AF37]/30 rounded-2xl overflow-hidden focus-within:border-[#D4AF37] focus-within:bg-white/[0.02] transition-all group">
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                className="w-full bg-transparent px-5 py-4 outline-none text-lg tracking-wide text-white font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={10}
                required
              />
            </div>
            <p className="text-[11px] text-gray-500 ml-1">MTN or Airtel number used for payment</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Access PIN</label>
              <button 
                type="button" 
                onClick={() => setShowForgotModal(true)}
                className="text-[#D4AF37] text-xs font-bold hover:text-white transition-colors"
              >
                Forgot PIN?
              </button>
            </div>
            <div className="flex bg-[#0a0a0a]/50 border border-[#D4AF37]/30 rounded-2xl overflow-hidden focus-within:border-[#D4AF37] focus-within:bg-white/[0.02] transition-all">
              <input
                type="password"
                placeholder="••••"
                className="w-full bg-transparent px-5 py-4 outline-none text-2xl tracking-[0.5em] text-white text-center font-black"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={4}
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-2xl border ${error.includes('successfully') ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                  <p className="text-sm font-bold text-center">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: (phone.length >= 10 && pin.length >= 4) ? 1.02 : 1 }}
            whileTap={{ scale: (phone.length >= 10 && pin.length >= 4) ? 0.98 : 1 }}
            disabled={phone.length < 10 || pin.length < 4 || loading}
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold transition-all disabled:opacity-30 disabled:grayscale shadow-[0_5px_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                UNLOCK ACCESS <ArrowRight size={22} strokeWidth={2.5} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-semibold flex items-center justify-center gap-2">
            <ArrowRight size={14} className="rotate-180" /> Return to Homepage
          </Link>
        </div>
      </motion.div>

      {/* Forgot PIN Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-panel border border-white/10 p-8 rounded-[2rem] relative"
            >
              <button 
                onClick={() => setShowForgotModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mt-2">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LockKeyhole className="text-gray-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Reset PIN</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  To ensure account security, PIN resets are handled manually by our support team.
                </p>
                <p className="text-[#D4AF37] font-semibold mb-8 text-sm">
                  Please contact support on Telegram to verify your identity and reset your PIN.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
