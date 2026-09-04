"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUnread();
    registerPush();
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await fetch('/api/notifications/unread');
      const data = await res.json();
      if (data.unreadCount !== undefined) {
        setUnreadCount(data.unreadCount);
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const registerPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    try {
      // Register custom push SW or use the existing PWA SW
      let swReg = await navigator.serviceWorker.getRegistration();
      if (!swReg) {
         swReg = await navigator.serviceWorker.register('/push-sw.js');
      } else {
         // Also register push-sw.js directly to ensure we have the push listener if next-pwa doesn't include it
         await navigator.serviceWorker.register('/push-sw.js');
         swReg = await navigator.serviceWorker.ready;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    } catch (err) {
      console.error('Push registration failed:', err);
    }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST' });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }} 
        className="p-2 relative hover:bg-white/5 rounded-full transition-colors"
      >
        <Bell size={20} className="text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1525] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
            <h3 className="font-bold text-sm text-white">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div key={idx} className={`p-4 border-b border-white/5 ${notif.isRead ? 'opacity-70' : 'bg-primary/5'}`}>
                  <h4 className="text-sm font-bold text-white mb-1">{notif.title}</h4>
                  <p className="text-xs text-gray-400">{notif.message}</p>
                  <span className="text-[10px] text-gray-500 mt-2 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
