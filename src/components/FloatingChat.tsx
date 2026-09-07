"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ShieldCheck, Headset } from "lucide-react";
import { sendChatMessage, getChatMessages, markChatMessagesRead, saveBotMessage } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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
      pollInterval.current = setInterval(fetchMessages, 3000);
      setTimeout(scrollToBottom, 100);
    } else {
      if (pollInterval.current) clearInterval(pollInterval.current);
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [isOpen, sessionId]);

  // Initial fetch for unread count even when closed
  useEffect(() => {
    if (!isOpen && sessionId) {
      fetchMessages();
      // Poll less frequently when closed
      const bgPoll = setInterval(fetchMessages, 10000);
      return () => clearInterval(bgPoll);
    }
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId || isSending) return;

    const content = inputValue;
    setInputValue("");
    setIsSending(true);

    // Optimistic update
    const newMsg = {
      id: Date.now().toString(),
      sessionId,
      content,
      isAdmin: false,
      isRead: false,
      createdAt: new Date(),
      status: "sending"
    };
    
    // Add to local state immediately
    setPendingMessages(prev => [...prev, newMsg]);

    const result = await sendChatMessage(sessionId, content);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] sm:w-[360px] h-[450px] bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#d4af37] to-[#eeb98c] p-4 flex justify-between items-center text-black">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">SK Support</h3>
                  <p className="text-[10px] font-bold opacity-80">Online | We reply fast!</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#09090b]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2 opacity-50">
                  <MessageCircle size={32} />
                  <p className="text-sm font-bold">Ask us anything!</p>
                </div>
              )}
              {allMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.isAdmin ? "bg-white/10 text-white rounded-tl-none border border-white/5" : "bg-gradient-to-br from-[#d4af37] to-[#b5952f] text-black rounded-tr-none font-medium shadow-md"}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[9px] mt-1 block flex justify-end gap-1 items-center ${msg.isAdmin ? "text-gray-400 justify-start" : "text-black/60"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {!msg.isAdmin && msg.status === "sending" && <span className="opacity-70 text-[9px]">(Sending...)</span>}
                      {!msg.isAdmin && msg.status === "error" && <span className="text-red-800 font-bold text-[9px]">(Failed)</span>}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a35] text-white p-3 rounded-2xl rounded-bl-sm max-w-[80%] border border-white/10 flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-[#12121a] flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#09090b] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="bg-[#d4af37] text-black w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#b5952f] transition-colors shrink-0"
              >
                <Send size={16} className={isSending ? "opacity-50" : ""} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] h-[60px] bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[24px] rounded-br-[6px] shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all hover:scale-110 relative border-2 border-white/20"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle size={32} className="fill-transparent stroke-[2]" />
            <Headset size={16} className="absolute stroke-[2.5]" />
          </div>
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#09090b] shadow-lg animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
