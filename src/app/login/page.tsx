"use client";

import { useState } from "react";
import { LockKeyhole, ArrowRight, X, Phone, ShieldCheck, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { verifyVipLogin, resetVipPin } from "@/app/actions";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Forgot PIN state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<"phone" | "code" | "new_pin">("phone");
  const [resetPhone, setResetPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

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
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    setForgotLoading(true);
    setForgotError("");
    
    if (resetPhone.length < 10) {
      setForgotError("Please enter a valid 10-digit phone number.");
      setForgotLoading(false);
      return;
    }

    // Simulate sending an SMS
    setTimeout(() => {
      setForgotStep("code");
      setForgotLoading(false);
    }, 1500);
  };

  const handleVerifyCode = () => {
    setForgotError("");
    if (resetCode.length < 4) {
      setForgotError("Please enter the 4-digit code.");
      return;
    }
    // Mock verification - any 4 digits work for now in this demo
    setForgotStep("new_pin");
  };

  const handleSaveNewPin = async () => {
    setForgotLoading(true);
    setForgotError("");
    
    if (newPin.length < 4) {
      setForgotError("Please enter a 4-digit PIN.");
      setForgotLoading(false);
      return;
    }

    const res = await resetVipPin(resetPhone, newPin);
    if (!res.success) {
      setForgotError(res.error || "Failed to reset PIN.");
      setForgotLoading(false);
      return;
    }

    // Success!
    setPhone(resetPhone);
    setPin(newPin);
    setShowForgotModal(false);
    setForgotStep("phone");
    setResetPhone("");
    setResetCode("");
    setNewPin("");
    setForgotLoading(false);
    setError("PIN reset successfully. You can now login.");
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0a14] text-foreground flex items-center justify-center p-4">
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
            <label className="block text-sm font-bold mb-2 text-gray-400 uppercase tracking-widest">Phone Number (MTN/Airtel)</label>
            <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                className="w-full bg-transparent px-5 py-4 outline-none text-lg tracking-wide text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={10}
                required
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 pl-1">E.g., 0774000000 or 0752000000</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">Security PIN</label>
              <button 
                type="button" 
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotStep("phone");
                  setForgotError("");
                }}
                className="text-primary text-xs font-bold hover:underline"
              >
                Forgot PIN?
              </button>
            </div>
            <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                type="password"
                placeholder="••••"
                className="w-full bg-transparent px-5 py-4 outline-none text-lg tracking-widest text-white text-center"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={4}
                required
              />
            </div>
          </div>

          {error && (
            <div className={`p-4 border rounded-xl ${error.includes('successfully') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <p className={`text-sm font-bold text-center ${error.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>{error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: (phone.length >= 10 && pin.length >= 4) ? 1.02 : 1 }}
            whileTap={{ scale: (phone.length >= 10 && pin.length >= 4) ? 0.98 : 1 }}
            disabled={phone.length < 10 || pin.length < 4 || loading}
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
          <a href="/" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Return to Homepage</a>
        </div>
      </motion.div>

      {/* Forgot PIN Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#1a1423] border border-white/10 p-6 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-white mb-6 text-center">Reset PIN</h2>

              {forgotStep === "phone" && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="text-primary" size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 text-center mb-4">Enter your registered phone number to receive a verification code.</p>
                  <div>
                    <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary">
                      <input
                        type="tel"
                        placeholder="07XX XXX XXX"
                        className="w-full bg-transparent px-4 py-3 outline-none text-white text-center"
                        value={resetPhone}
                        onChange={(e) => setResetPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {forgotError && <p className="text-xs text-red-400 text-center">{forgotError}</p>}
                  <button 
                    onClick={handleSendCode}
                    disabled={forgotLoading || resetPhone.length < 10}
                    className="w-full py-3 mt-2 rounded-xl bg-primary text-black font-bold disabled:opacity-50 flex justify-center items-center"
                  >
                    {forgotLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : "Send Code"}
                  </button>
                </div>
              )}

              {forgotStep === "code" && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="text-primary" size={24} />
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                    <p className="text-xs text-yellow-400 text-center">
                      (Mock Mode: Since real SMS costs money, please just enter <strong>1234</strong> to simulate verifying your phone.)
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 text-center mb-4">Enter the 4-digit code sent to {resetPhone}</p>
                  <div>
                    <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary">
                      <input
                        type="text"
                        placeholder="••••"
                        className="w-full bg-transparent px-4 py-3 outline-none text-white text-center tracking-widest text-lg"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  {forgotError && <p className="text-xs text-red-400 text-center">{forgotError}</p>}
                  <button 
                    onClick={handleVerifyCode}
                    className="w-full py-3 mt-2 rounded-xl bg-primary text-black font-bold flex justify-center items-center"
                  >
                    Verify Code
                  </button>
                </div>
              )}

              {forgotStep === "new_pin" && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <KeyRound className="text-primary" size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 text-center mb-4">Create your new 4-digit login PIN.</p>
                  <div>
                    <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary">
                      <input
                        type="password"
                        placeholder="••••"
                        className="w-full bg-transparent px-4 py-3 outline-none text-white text-center tracking-widest text-lg"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  {forgotError && <p className="text-xs text-red-400 text-center">{forgotError}</p>}
                  <button 
                    onClick={handleSaveNewPin}
                    disabled={forgotLoading || newPin.length < 4}
                    className="w-full py-3 mt-2 rounded-xl bg-primary text-black font-bold disabled:opacity-50 flex justify-center items-center"
                  >
                    {forgotLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : "Save New PIN"}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
