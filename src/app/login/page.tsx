"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { verifyVipLogin } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await verifyVipLogin(phone);

    if (result.success) {
      router.push("/vip-dashboard");
    } else {
      setError(result.error || "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a14] text-foreground flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#120d1d] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <LockKeyhole className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">VIP Access</h1>
          <p className="text-gray-400">Login to view your premium tickets</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-400 uppercase tracking-widest">Registered Phone Number</label>
            <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <div className="bg-white/5 px-4 py-4 flex items-center justify-center border-r border-white/10 text-gray-400 font-bold">
                +256
              </div>
              <input
                type="tel"
                placeholder="770 000 000"
                className="w-full bg-transparent px-5 py-4 outline-none text-lg tracking-wide text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={9}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400 font-bold">{error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: phone.length >= 9 ? 1.02 : 1 }}
            whileTap={{ scale: phone.length >= 9 ? 0.98 : 1 }}
            disabled={phone.length < 9 || loading}
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-[#d4af37] text-black font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                LOGIN <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <a href="/" className="text-primary hover:underline text-sm font-bold">Return to Homepage</a>
        </div>
      </motion.div>
    </div>
  );
}
