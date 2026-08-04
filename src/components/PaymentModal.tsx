"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ShieldCheck, LockKeyhole, CheckCircle2, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { initiatePaymentByName } from "@/app/actions";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  price: string;
  tier?: string | null;
  tierPackages?: {name: string, price: string}[];
}

type Step = "network" | "details" | "processing" | "success" | "failed";

export default function PaymentModal({ isOpen, onClose, packageName, price, tier, tierPackages }: PaymentModalProps) {
  const [step, setStep] = useState<Step>("network");
  const [network, setNetwork] = useState<"MTN" | "AIRTEL">("MTN");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const [selectedPkgName, setSelectedPkgName] = useState(packageName);
  const [selectedPkgPrice, setSelectedPkgPrice] = useState(price);

  useEffect(() => {
    if (tierPackages && tierPackages.length > 0 && !selectedPkgName) {
      setTimeout(() => {
        setSelectedPkgName(tierPackages[0].name);
        setSelectedPkgPrice(tierPackages[0].price);
      }, 0);
    } else if (!tierPackages || tierPackages.length === 0) {
      if (selectedPkgName !== packageName || selectedPkgPrice !== price) {
        setTimeout(() => {
          setSelectedPkgName(packageName);
          setSelectedPkgPrice(price);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierPackages, packageName, price, isOpen]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback((refId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // Poll for max 5 minutes (5s interval)

    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        stopPolling();
        setStep("failed");
        setError("Payment timed out. If money was deducted, please contact support.");
        return;
      }

      try {
        const res = await fetch(`/api/payment-status/${refId}`);
        const data = await res.json();

        if (data.status === "SUCCESSFUL") {
          stopPolling();
          setStep("success");
        } else if (data.status === "FAILED") {
          stopPolling();
          setStep("failed");
          setError(data.reason || "Payment was declined or cancelled by the user.");
        }
        // If PENDING, keep polling
      } catch {
        // Network error — keep polling
      }
    }, 5000);
  }, [stopPolling]);

  const handlePayment = async () => {
    setError("");

    // Client-side validation
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phone.length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (pin.length < 4) {
      setError("Please create a 4-digit PIN.");
      return;
    }

    setStep("processing");

    try {
      let numericAmount = 0;
      const cleanPrice = selectedPkgPrice.replace(/,/g, '').toLowerCase().trim();
      if (cleanPrice.endsWith('k')) {
        numericAmount = parseFloat(cleanPrice.replace('k', '')) * 1000;
      } else {
        numericAmount = parseInt(cleanPrice, 10);
      }

      // 1. Quietly create pending account and order
      const res = await initiatePaymentByName(phone, selectedPkgName, pin, name.trim(), numericAmount);

      if (!res.success || !res.referenceId) {
        setStep("failed");
        setError(res.error || "Failed to initiate payment. Please try again.");
        return;
      }

      startPolling(res.referenceId);
      
    } catch {
      setStep("failed");
      setError("Network error. Please check your internet connection and try again.");
    }
  };

  const handleRetry = () => {
    stopPolling();
    setStep("details");
    setError("");
  };

  const handleClose = () => {
    stopPolling();
    onClose();
    setTimeout(() => {
      setStep("network");
      setPhone("");
      setPin("");
      setName("");
      setError("");
    }, 300);
  };

  const handleSuccess = () => {
    handleClose();
    router.push("/login");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={step !== "processing" ? handleClose : undefined}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 300 } }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#120d1d] border border-white/10 w-full max-w-md rounded-3xl p-6 sm:p-8 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Decorative Blob */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>

              {step !== "processing" && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              )}

              {/* HEADER */}
              <div className="text-center mb-6 relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  {step === "success" ? (
                    <ShieldCheck className="text-[#25D366]" size={24} />
                  ) : step === "failed" ? (
                    <AlertTriangle className="text-red-400" size={24} />
                  ) : (
                    <LockKeyhole className="text-primary" size={24} />
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {step === "success" ? "Payment Successful!" : step === "failed" ? "Payment Failed" : (tier || selectedPkgName)}
                </h3>
                {(step === "details" || step === "processing") && !tierPackages?.length && (
                  <p className="text-primary font-bold text-lg mt-1">{selectedPkgPrice} UGX</p>
                )}
              </div>

              {/* ===== STEP: NETWORK SELECTION ===== */}
              {step === "network" && (
                <motion.div
                  key="network"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="relative z-10 space-y-4"
                >
                  <p className="text-center text-gray-400 mb-6 text-sm">Select your mobile money provider</p>
                  
                  <button
                    onClick={() => {
                      setNetwork("MTN");
                      setStep("details");
                    }}
                    className="w-full flex items-center p-4 rounded-xl border border-yellow-400/30 bg-yellow-400/5 hover:bg-yellow-400/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-4 group-hover:scale-105 transition-transform bg-[#ffcc00]">
                      <img src="/mtn.png" alt="MTN" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-white font-bold text-lg">MTN Mobile Money</h4>
                      <p className="text-gray-400 text-xs">Pay with MTN Mobile Money</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setNetwork("AIRTEL");
                      setStep("details");
                    }}
                    className="w-full flex items-center p-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-4 group-hover:scale-105 transition-transform bg-white">
                      <img src="/airtel.png" alt="Airtel" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-bold text-lg">Airtel Money</h4>
                      <p className="text-gray-400 text-xs">Pay with Airtel Money</p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* ===== STEP: DETAILS ===== */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="relative z-10 space-y-4"
                >
                  {/* Network Badge */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {network === "MTN" ? (
                      <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#ffcc00]">
                          <img src="/mtn.png" alt="MTN" className="w-full h-full object-cover scale-110" />
                        </div>
                        <span className="text-yellow-400 font-bold text-sm">MTN Mobile Money</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white">
                          <img src="/airtel.png" alt="Airtel" className="w-full h-full object-contain p-0.5" />
                        </div>
                        <span className="text-red-500 font-bold text-sm">Airtel Money</span>
                      </div>
                    )}
                  </div>

                  {/* Package Selection (If tier) */}
                  {tierPackages && tierPackages.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">Select {tier} Package</label>
                      <select
                        value={selectedPkgName}
                        onChange={(e) => {
                          const pkg = tierPackages.find(p => p.name === e.target.value);
                          if (pkg) {
                            setSelectedPkgName(pkg.name);
                            setSelectedPkgPrice(pkg.price);
                          }
                        }}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                      >
                        {tierPackages.map((pkg) => (
                          <option key={pkg.name} value={pkg.name} className="bg-gray-900 text-white">
                            {pkg.name.replace(tier + ': ', '')} - {pkg.price} UGX
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Mukasa"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">{network} Phone Number</label>
                    <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <span className="flex items-center pl-5 pr-2 text-gray-400 font-bold text-lg border-r border-white/10 bg-white/5">+256</span>
                      <input
                        type="tel"
                        placeholder={network === "MTN" ? "770 000 000" : "750 000 000"}
                        className="w-full bg-transparent px-4 py-3.5 outline-none text-lg tracking-wide text-white"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9 ]/g, ''))}
                        maxLength={12}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2">Ensure this number is registered on {network === "MTN" ? "MTN Mobile Money" : "Airtel Money"}</p>
                  </div>

                  {/* PIN Input */}
                  <div>
                    <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">Create a 4-Digit PIN for Login</label>
                    <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <input
                        type="password"
                        placeholder="••••"
                        className="w-full bg-transparent px-5 py-3.5 outline-none text-lg tracking-[0.5em] text-center text-white"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                      />
                    </div>
                    <p className="text-[11px] text-primary mt-2">You will use your Phone Number and this PIN to access your tickets.</p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-sm text-red-400 font-bold">{error}</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: (phone.length >= 9 && name.trim().length >= 2 && pin.length >= 4) ? 1.02 : 1 }}
                    whileTap={{ scale: (phone.length >= 9 && name.trim().length >= 2 && pin.length >= 4) ? 0.98 : 1 }}
                    onClick={handlePayment}
                    disabled={phone.length < 9 || name.trim().length < 2 || pin.length < 4}
                    className={`w-full py-4 rounded-xl font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 text-lg ${
                      network === 'MTN' 
                        ? 'bg-gradient-to-r from-primary to-[#d4af37] text-black' 
                        : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_5px_15px_rgba(220,38,38,0.2)]'
                    }`}
                  >
                    Pay {selectedPkgPrice} UGX
                  </motion.button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mt-2">
                    <ShieldCheck size={14} className={network === "MTN" ? "text-[#25D366]" : "text-red-400"} />
                    <span>Secured by {network === "MTN" ? "MTN Mobile Money" : "Airtel Money"}</span>
                  </div>
                </motion.div>
              )}

              {/* ===== STEP: PROCESSING ===== */}
              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center relative z-10 py-6"
                >
                  <div className="flex justify-center mb-6">
                    <Loader2 className="animate-spin text-primary" size={48} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Check your phone!</h4>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                    A prompt has been sent to <span className="font-bold text-white">+256 {phone}</span>.
                    Please enter your MTN Mobile Money PIN to authorize the payment of{" "}
                    <span className="font-bold text-primary">{selectedPkgPrice} UGX</span>.
                  </p>

                  <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 inline-block">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      Waiting for payment confirmation...
                    </p>
                  </div>

                  <p className="text-[11px] text-gray-600 mt-4">Do not close this window</p>
                </motion.div>
              )}

              {/* ===== STEP: SUCCESS ===== */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center relative z-10 py-4"
                >
                  <div className="w-20 h-20 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.3)]">
                    <CheckCircle2 className="text-[#25D366]" size={40} />
                  </div>
                  <p className="text-gray-300 mb-3 text-lg">Payment of <span className="font-bold text-primary">{selectedPkgPrice} UGX</span> confirmed!</p>
                  <p className="text-gray-400 text-sm mb-8">
                    Your <span className="font-bold text-white">{selectedPkgName}</span> subscription is now active.
                    Log in with your phone number to access your premium tickets.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSuccess}
                    className="w-full py-4 rounded-xl bg-[#25D366] text-black font-extrabold hover:bg-[#1da851] transition-colors shadow-[0_5px_15px_rgba(37,211,102,0.3)]"
                  >
                    Login to View My Tickets
                  </motion.button>
                </motion.div>
              )}

              {/* ===== STEP: FAILED ===== */}
              {step === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center relative z-10 py-4"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500/50">
                    <AlertTriangle className="text-red-400" size={40} />
                  </div>
                  <p className="text-gray-300 mb-3 text-lg font-bold">Payment was not completed</p>
                  {error && (
                    <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">{error}</p>
                  )}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRetry}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-[#d4af37] text-black font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} /> Try Again
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
