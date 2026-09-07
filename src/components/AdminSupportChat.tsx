"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle, Paperclip, Smile, X } from "lucide-react";
import { getAdminChatSessions, getChatMessages, sendChatMessage, markChatMessagesRead, uploadChatAttachment } from "@/app/actions";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function AdminSupportChat({ adminToken }: { adminToken?: string }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchSessions = async () => {
    const data = await getAdminChatSessions(adminToken);
    setSessions(data);
  };

  const fetchMessages = async (sessionId: string) => {
    const data = await getChatMessages(sessionId);
    setMessages(data);
    
    const hasUnread = data.some((m: any) => !m.isAdmin && !m.isRead);
    if (hasUnread) {
      await markChatMessagesRead(sessionId, true, adminToken);
      fetchSessions(); // update unread counts
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      fetchSessions();
      if (selectedSessionId) {
        fetchMessages(selectedSessionId);
      }
    }, 5000);
    pollInterval.current = interval;
    
    return () => clearInterval(interval);
  }, [selectedSessionId, adminToken]);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
    } else {
      setMessages([]);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputValue.trim() && !attachment) || !selectedSessionId || isSending) return;

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

    const newMsg = {
      id: Date.now().toString(),
      sessionId: selectedSessionId,
      content,
      isAdmin: true,
      isRead: false,
      createdAt: new Date(),
      imageUrl: uploadedImageUrl,
      attachmentName: uploadedAttachmentName
    };
    setMessages(prev => [...prev, newMsg]);

    await sendChatMessage(selectedSessionId, content, adminToken, uploadedImageUrl, uploadedAttachmentName);
    await fetchMessages(selectedSessionId);
    setIsSending(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      
      {/* Sessions List */}
      <div className="w-full md:w-1/3 bg-[#15151a] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl">
        <div className="p-4 border-b border-white/5 bg-[#0d0d12]">
          <h3 className="font-bold flex items-center gap-2"><MessageCircle size={18} className="text-[#d4af37]" /> Active Chats</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No active chats</div>
          ) : (
            sessions.map(s => (
              <button
                key={s.sessionId}
                onClick={() => setSelectedSessionId(s.sessionId)}
                className={`w-full text-left p-4 rounded-2xl transition-colors flex gap-3 ${selectedSessionId === s.sessionId ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b5952f] flex items-center justify-center shrink-0">
                  <User size={18} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white truncate">Guest User</span>
                    <span className="text-[10px] text-gray-500">{new Date(s.latestMessage?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{s.latestMessage?.content}</p>
                </div>
                {s.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full h-fit self-center">
                    {s.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-[#15151a] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl">
        {selectedSessionId ? (
          <>
            <div className="p-4 border-b border-white/5 bg-[#0d0d12] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b5952f] flex items-center justify-center">
                <User size={18} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold">Guest User</h3>
                <p className="text-xs text-gray-500 font-mono">ID: {selectedSessionId.slice(0,8)}...</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#09090b]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${msg.isAdmin ? "bg-[#d4af37] text-black rounded-tr-none font-medium" : "bg-white/10 text-white rounded-tl-none"}`}>
                    {msg.imageUrl && !msg.attachmentName && (
                      <img src={msg.imageUrl} alt="attachment" className="mb-2 rounded-lg max-w-full h-auto object-cover max-h-[250px]" />
                    )}
                    {msg.imageUrl && msg.attachmentName && (
                      <a href={msg.imageUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline mb-2 block break-all text-xs font-bold">
                        📎 {msg.attachmentName}
                      </a>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[10px] mt-2 block ${msg.isAdmin ? "text-black/60 text-right" : "text-gray-500"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="relative">
              {showEmoji && (
                <div className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl">
                  <EmojiPicker onEmojiClick={(e) => setInputValue(prev => prev + e.emoji)} theme="dark" width={320} height={400} />
                </div>
              )}
              {attachment && (
                <div className="absolute bottom-full left-0 mb-4 bg-[#1a1a24] p-3 rounded-lg border border-white/10 flex items-center justify-between gap-3 max-w-[250px]">
                  <span className="text-xs text-white truncate">{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-400"><X size={16} /></button>
                </div>
              )}
              <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-[#0d0d12] flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Paperclip size={24} />
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
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-[#15151a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Smile size={24} />
                </button>
                <button
                  type="submit"
                  disabled={(!inputValue.trim() && !attachment) || isSending}
                  className="bg-[#d4af37] text-black px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#b5952f] transition-colors shrink-0 font-bold gap-2 ml-2"
                >
                  <Send size={16} /> Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50">
            <MessageCircle size={48} />
            <p className="font-bold">Select a chat session to view messages</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
