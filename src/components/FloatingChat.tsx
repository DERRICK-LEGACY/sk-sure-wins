"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ShieldCheck, Headset, Paperclip, Smile } from "lucide-react";
import { sendChatMessage, getChatMessages, markChatMessagesRead, saveBotMessage, uploadChatAttachment } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get or create session ID
    let sid = localStorage.getItem("sk_chat_session");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("sk_chat_session", sid);
    }
    setSessionId(sid);
  }, []);

  const fetchMessages = async () => {
    if (!sessionId) return;
    const msgs = await getChatMessages(sessionId);
    // Combine server messages with any pending/failed optimistic ones
    setMessages(msgs);
    
    // Mark messages as read if chat is open
    if (isOpen) {
      const hasUnread = msgs.some((m: any) => m.isAdmin && !m.isRead);
      if (hasUnread) {
        await markChatMessagesRead(sessionId, false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      pollInterval.current = setInterval(fetchMessages, 10000);
      setTimeout(scrollToBottom, 100);
    } else {
      if (pollInterval.current) clearInterval(pollInterval.current);
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [isOpen, sessionId]);

  // Initial fetch for unread count ONLY when session is loaded (NO POLLING IN BACKGROUND)
  useEffect(() => {
    if (sessionId) {
      fetchMessages();
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputValue.trim() && !attachment) || !sessionId || isSending) return;

    const content = inputValue;
    setInputValue("");
    setIsSending(true);
    setShowEmoji(false);

    let uploadedImageUrl = undefined;
    let uploadedAttachmentName = undefined;

    if (attachment) {
      const formData = new FormData();
      formData.append('file', attachment);
      const uploadRes = await uploadChatAttachment(formData);
      if (uploadRes.success) {
        if (attachment.type.startsWith('image/')) {
          uploadedImageUrl = uploadRes.url;
        } else {
          uploadedImageUrl = uploadRes.url;
          uploadedAttachmentName = attachment.name;
        }
      }
      setAttachment(null);
    }

    // Optimistic update
    const newMsg = {
      id: Date.now().toString(),
      sessionId,
      content,
      isAdmin: false,
      isRead: false,
      createdAt: new Date(),
      status: "sending",
      imageUrl: uploadedImageUrl,
      attachmentName: uploadedAttachmentName
    };
    
    // Add to local state immediately
    setPendingMessages(prev => [...prev, newMsg]);

    const result = await sendChatMessage(sessionId, content, undefined, uploadedImageUrl, uploadedAttachmentName);
    if (!result.success) {
      console.error(result.error);
      setPendingMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: "error" } : m));
      setIsSending(false);
      return;
    }
    
    // Success: it will be fetched from server on next fetchMessages
    setPendingMessages(prev => prev.filter(m => m.id !== newMsg.id));
    fetchMessages();
    setIsSending(false);

    if (result.botReply) {
      setIsTyping(true);
      setTimeout(async () => {
        const botMessage = {
          id: Date.now().toString() + "_bot",
          content: result.botReply,
          isAdmin: true,
          createdAt: new Date(),
          status: "sent"
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        await saveBotMessage(sessionId, result.botReply);
      }, 1500 + Math.random() * 1000); // 1.5 - 2.5s simulated typing delay
    }
  };

  const allMessages = [...messages, ...pendingMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const unreadCount = messages.filter(m => m.isAdmin && !m.isRead).length;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] max-h-[600px] bg-[#111116] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden glass-panel"
          >
            {/* Header */}
            <div className="bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent opacity-50 pointer-events-none"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b5952f] rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0">
                  <Headset size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-white">SK Support</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[11px] text-gray-400 font-medium">Online | We reply fast!</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors relative z-10 shrink-0 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0A0A0F]/50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-60">
                  <MessageCircle size={40} className="text-[#d4af37]/40" />
                  <p className="text-sm font-medium">Ask us anything!</p>
                </div>
              )}
              {allMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.isAdmin ? "bg-[#1A1A24] text-gray-200 rounded-tl-sm border border-white/5 shadow-sm" : "bg-gradient-to-br from-[#d4af37] to-[#b5952f] text-black rounded-tr-sm font-medium shadow-md"}`}>
                    {msg.imageUrl && !msg.attachmentName && (
                      <img src={msg.imageUrl} alt="attachment" className="mt-1 mb-3 rounded-lg max-w-full h-auto object-cover max-h-[160px] shadow-sm" />
                    )}
                    {msg.imageUrl && msg.attachmentName && (
                      <a href={msg.imageUrl} target="_blank" rel="noreferrer" className="text-blue-900 underline mb-2 block break-all text-xs font-bold bg-white/20 p-2 rounded-md">
                        📎 {msg.attachmentName}
                      </a>
                    )}
                    <p className="text-[13px] sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <div className={`text-[9px] sm:text-[10px] mt-1.5 flex justify-end gap-1.5 items-center ${msg.isAdmin ? "text-gray-500 justify-start" : "text-black/70"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {!msg.isAdmin && msg.status === "sending" && <span className="opacity-70">(Sending...)</span>}
                      {!msg.isAdmin && msg.status === "error" && <span className="text-red-800 font-bold">(Failed)</span>}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A24] p-4 rounded-2xl rounded-bl-sm max-w-[80%] border border-white/5 flex gap-1.5 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input */}
            <div className="relative shrink-0 border-t border-white/5 bg-[#111116]">
              {showEmoji && (
                <div className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl">
                  <EmojiPicker onEmojiClick={(e) => setInputValue(prev => prev + e.emoji)} theme="dark" width={300} height={350} />
                </div>
              )}
              {attachment && (
                <div className="absolute bottom-full left-0 mb-2 bg-[#1A1A24] p-2.5 rounded-lg border border-white/10 flex items-center justify-between gap-3 max-w-[80%] shadow-xl ml-2">
                  <span className="text-xs text-white truncate font-medium">{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} className="text-red-400 hover:text-red-300 transition-colors p-1 bg-red-500/10 rounded-md"><X size={14} /></button>
                </div>
              )}
              <form onSubmit={handleSend} className="p-2 sm:p-3 flex gap-2 items-center w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all shrink-0"
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachment(e.target.files[0]);
                    }
                  }}
                />
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-[#1A1A24] border border-white/10 rounded-full pl-4 pr-10 py-2.5 sm:py-3 text-[13px] sm:text-sm text-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d4af37] transition-colors"
                  >
                    <Smile size={18} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={(!inputValue.trim() && !attachment) || isSending}
                  className="bg-[#d4af37] text-black w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center disabled:opacity-50 disabled:grayscale hover:bg-[#b5952f] hover:scale-105 active:scale-95 transition-all shrink-0 shadow-lg"
                >
                  <Send size={18} className={`ml-0.5 ${isSending ? "opacity-50" : ""}`} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 sm:h-14 sm:w-14 bg-[#111116] hover:bg-[#1A1A24] text-[#d4af37] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative border border-[#d4af37]/50 group z-50 glass-panel"
      >
        {isOpen ? (
          <X size={24} className="sm:w-7 sm:h-7" />
        ) : (
          <MessageCircle size={24} className="sm:w-7 sm:h-7 stroke-[2]" />
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-black w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border-2 border-[#111116] shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
