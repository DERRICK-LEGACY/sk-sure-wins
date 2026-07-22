"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await loginAdmin(password);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a14] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1525] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/30 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <LockKeyhole className="text-red-400" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Admin Access</h1>
          <p className="text-gray-400">Enter admin password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full bg-black/50 border border-white/10 px-5 py-4 rounded-xl outline-none text-lg text-white focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400 font-bold">{error}</p>
            </div>
          )}

          <button
            disabled={!password || loading}
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>LOGIN <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <a href="/" className="text-gray-500 hover:text-gray-400 text-sm">Return to Homepage</a>
        </div>
      </div>
    </div>
  );
}
