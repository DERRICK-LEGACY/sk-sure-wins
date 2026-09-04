"use client";

import { useState, useEffect } from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';

export default function EnableNotificationsBanner({ userId }: { userId: string }) {
  const [permission, setPermission] = useState<NotificationPermission | 'loading'>('loading');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setPermission('denied'); // Not supported
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleEnablePush = async (isAutoSync = false) => {
    if (!isAutoSync) setIsSubscribing(true);
    try {
      let result = permission;
      if (!isAutoSync) {
         result = await Notification.requestPermission();
         setPermission(result);
      }

      if (result === 'granted') {
        let swReg = await navigator.serviceWorker.getRegistration();
        if (!swReg) {
           swReg = await navigator.serviceWorker.register('/push-sw.js');
        } else {
           await navigator.serviceWorker.register('/push-sw.js');
           swReg = await navigator.serviceWorker.ready;
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) throw new Error("VAPID Key is missing in environment variables.");

        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

        const subscription = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });

        const res = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });

        if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.error || `Server returned ${res.status}`);
        }
        
        localStorage.setItem(`push_synced_${userId}`, 'true');
      }
    } catch (err: any) {
      console.error('Push registration failed:', err);
      if (!isAutoSync) alert('Push setup failed: ' + err.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Auto-sync if permission is already granted but we haven't synced for this user on this device
  useEffect(() => {
    if (permission === 'granted' && userId) {
      const hasSynced = localStorage.getItem(`push_synced_${userId}`);
      if (!hasSynced) {
        handleEnablePush(true);
      }
    }
  }, [permission, userId]);

  if (permission === 'granted' || permission === 'denied' || permission === 'loading') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 border border-blue-500/30">
          <BellRing className="text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white mb-1">Get Instant Ticket Alerts!</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Never miss a VIP ticket. Enable push notifications to receive an alert on your phone the second we upload new odds.
          </p>
        </div>
      </div>

      <button 
        onClick={handleEnablePush} 
        disabled={isSubscribing}
        className="w-full md:w-auto shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2"
      >
        {isSubscribing ? 'Enabling...' : (
          <>
            <CheckCircle2 size={18} /> Enable Alerts
          </>
        )}
      </button>
    </div>
  );
}
