"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginAdmin(password);
      if (result.success) {
        window.location.reload();
      } else {
        setError(result.error || "Login failed.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred connecting to the database.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hyper Background for Admin */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10"
      >
        <div className="text-center mb-8 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-red-600/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative"
          >
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping opacity-30"></div>
            <LockKeyhole className="text-red-500" size={36} strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">System Admin</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-red-500/10 w-max mx-auto px-3 py-1 rounded-full border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-semibold tracking-widest uppercase text-xs">Restricted Access</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Master Password</label>
            <div className="flex bg-black/40 border border-white/10 rounded-2xl overflow-hidden focus-within:border-red-500/50 focus-within:bg-white/[0.02] transition-all">
              <input
                type="password"
                placeholder="Enter master key"
                className="w-full bg-transparent px-5 py-4 outline-none text-lg text-white font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden"
            >
              <p className="text-sm text-red-400 font-bold text-center">{error}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: password ? 1.02 : 1 }}
            whileTap={{ scale: password ? 0.98 : 1 }}
            disabled={!password || loading}
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-extrabold transition-all disabled:opacity-30 disabled:grayscale shadow-[0_5px_20px_rgba(239,68,68,0.3)] flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                AUTHORIZE <ArrowRight size={22} strokeWidth={2.5} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-semibold flex items-center justify-center gap-2">
            <ArrowRight size={14} className="rotate-180" /> Back to Safety
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
