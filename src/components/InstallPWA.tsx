"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's already installed (standalone mode)
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isAppStandalone = window.matchMedia("(display-mode: standalone)").matches || !!nav.standalone;

    setTimeout(() => setIsStandalone(isAppStandalone), 0);

    if (isAppStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Defer state updates to avoid cascading renders
    setTimeout(() => {
      setIsIOS(isIosDevice);
      
      if (isIosDevice) {
        // For iOS, just show our custom prompt after a few seconds
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    }, 0);

    // For Android / Chrome Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#1a1525] border border-primary/30 shadow-2xl shadow-primary/20 rounded-2xl p-4 z-[9999] flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl p-0.5 flex-shrink-0">
            <div className="w-full h-full bg-[#0f0a14] rounded-[10px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-192.png" alt="App Icon" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm">Install SK Sure Wins</h4>
            <p className="text-gray-400 text-xs mt-1">
              {isIOS 
                ? "Tap the Share button below and select 'Add to Home Screen' for quick access."
                : "Install our app for the fastest betting tips experience."}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setShowPrompt(false)}
              className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full p-1 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors"
              >
                <Download size={14} /> Install
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
