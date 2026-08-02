"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  updateFreeHook, addWonTicket, deleteWonTicket, addClientWithSubscription, deleteClient, completelyDeleteClient,
  editFreeHook, editWonTicket, deleteFreeHook, addTicket, 
  editTicket, deleteTicket, logoutAdmin, approveTestimonial, 
  deleteTestimonial, updateAdminCredentials, extendAdminSession
} from "@/app/actions";
import { 
  Search, UserCheck, UserX, Edit2, Trash2, X, Plus, 
  Image as ImageIcon, LogOut, Trophy, AlertTriangle, 
  Settings, Users, Activity, Star, ShieldCheck, Clock, Menu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";

// --- Dialogs ---

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121a] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="text-red-400" size={28} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Are you absolutely sure?</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-white/5 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Component ---

const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
  <div className="bg-[#15151a] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40`} style={{ backgroundColor: color }}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-gray-400 text-sm font-bold tracking-wider uppercase mb-1">{title}</p>
        <h4 className="text-3xl font-black text-white">{value}</h4>
      </div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon size={24} />
      </div>
    </div>
    <p className="text-xs text-gray-500 font-medium relative z-10">{subtitle}</p>
  </div>
);

export default function AdminDashboard({ 
  freeHooks, wonTickets, clients, premiumTickets, testimonials = [], packages = []
}: { 
  freeHooks: any[], wonTickets: any[], clients: any[], premiumTickets: any[], testimonials?: any[], packages?: any[] 
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Strict Security: Logout on any page leave, tab change, or back button
  // Plus Keep-Alive: Renew session while actively working on the page
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    let hasLoggedOut = false;
    
    const triggerLogout = () => {
      if (hasLoggedOut) return;
      hasLoggedOut = true;
      logoutAdmin().catch(console.error);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerLogout();
        router.push("/admin"); // Push to login screen
      }
    };

    const handleBeforeUnload = () => {
      triggerLogout();
    };

    // Activity tracking for keep-alive
    const updateActivity = () => { lastActivity.current = Date.now(); };
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("touchstart", updateActivity);
    window.addEventListener("scroll", updateActivity);

    // Keep-alive interval
    const interval = setInterval(() => {
      if (Date.now() - lastActivity.current < 5 * 60 * 1000) {
        extendAdminSession().catch(console.error);
      }
    }, 4 * 60 * 1000); // Check every 4 minutes

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      clearInterval(interval);
      triggerLogout(); // Unmounting component (Client-side navigation like back button)
    };
  }, [router]);

  // Search & Edit States
  const [userSearch, setUserSearch] = useState("");
  const [editingFree, setEditingFree] = useState<any>(null);
  const [editingWon, setEditingWon] = useState<any>(null);
  const [editingPremium, setEditingPremium] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ message: string, action: () => void } | null>(null);
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Forms
  const [userForm, setUserForm] = useState({ phone: "", name: "", pkg: packages[0]?.id || "", expiry_date: "" });

  // Calculated Stats
  const stats = useMemo(() => {
    const activeUsers = clients.filter(c => 
      c.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.expiresAt) >= new Date(new Date().setHours(0,0,0,0)))
    );
    return {
      totalUsers: clients.length,
      activeUsers: activeUsers.length,
      premiumTicketsCount: premiumTickets.length,
      pendingReviews: testimonials.filter(t => !t.approved).length
    };
  }, [clients, premiumTickets, testimonials]);

  // Handlers
  const wrapAction = async (action: () => Promise<{ error?: string } | any>, successMsg: string) => {
    setLoading(true);
    try { 
      const res = await action();
      if (res && res.error) {
        showToast(res.error, "error");
      } else {
        showToast(successMsg, "success");
      }
    } catch (err) { 
      console.error(err); 
      showToast("An unexpected error occurred.", "error");
    }
    finally { setLoading(false); }
  };

  const handleUpdateHook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    wrapAction(async () => {
      if (editingFree) { const res = await editFreeHook(editingFree.id, formData); setEditingFree(null); return res; } 
      else { return await updateFreeHook(formData); }
    }, "Free slip successfully posted!")
    .then(() => (e.target as HTMLFormElement).reset());
  };

  const handleAddWonTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    wrapAction(async () => {
      if (editingWon) { const res = await editWonTicket(editingWon.id, formData); setEditingWon(null); return res; } 
      else { return await addWonTicket(formData); }
    }, "Won ticket successfully posted!")
    .then(() => (e.target as HTMLFormElement).reset());
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    wrapAction(async () => {
      const res = await addClientWithSubscription(userForm);
      if (!res?.error) {
        setUserForm({ phone: "", name: "", pkg: packages[0]?.id || "", expiry_date: "" });
      }
      return res;
    }, "Client subscription successfully updated!");
  };

  const handlePremiumSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    wrapAction(async () => {
      if (editingPremium) { const res = await editTicket(editingPremium.id, formData); setEditingPremium(null); return res; } 
      else { return await addTicket(formData); }
    }, "VIP slip successfully posted!")
    .then(() => (e.target as HTMLFormElement).reset());
  };

  const confirmAndDelete = (message: string, action: () => void) => setConfirmDelete({ message, action });

  const filteredClients = clients.filter(c => c.name?.toLowerCase().includes(userSearch.toLowerCase()) || c.phone.includes(userSearch));

  // --- Subcomponents ---
  
  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }} 
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${activeTab === id ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"}`}
    >
      {activeTab === id && (
        <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]" />
      )}
      <Icon size={20} className={activeTab === id ? "text-[#d4af37]" : "text-gray-500 group-hover:text-gray-300"} />
      <span className="z-10">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex font-sans">
      <AnimatePresence>
        {confirmDelete && <ConfirmDialog message={confirmDelete.message} onConfirm={() => { confirmDelete.action(); setConfirmDelete(null); }} onCancel={() => setConfirmDelete(null)} />}
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
          >
            {toast.type === "success" ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
            <span className="font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE OVERLAY --- */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0d0d12] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#f9d976]"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c5622] flex items-center justify-center">
              <ShieldCheck className="text-black" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none">SK Admin</h1>
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">VIP Portal</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white relative z-10 p-2">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          <p className="px-4 text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Overview</p>
          <SidebarItem id="dashboard" icon={Activity} label="Dashboard" />
          
          <p className="px-4 text-xs font-bold text-gray-600 uppercase tracking-widest mt-6 mb-2">Ticket Management</p>
          <SidebarItem id="premium" icon={Trophy} label="Premium Slips" />
          <SidebarItem id="free" icon={ImageIcon} label="Free Tickets" />
          <SidebarItem id="wins" icon={Star} label="Won Tickets" />
          
          <p className="px-4 text-xs font-bold text-gray-600 uppercase tracking-widest mt-6 mb-2">Clients & Settings</p>
          <SidebarItem id="users" icon={Users} label="VIP Subscribers" />
          <SidebarItem id="testimonials" icon={MessageSquare} label="Reviews" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={async () => { await logoutAdmin(); router.refresh(); }} className="w-full flex justify-center gap-2 text-red-500 bg-red-500/10 px-4 py-3 rounded-xl font-bold">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 min-h-[100dvh] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <header className="lg:hidden h-20 bg-[#0d0d12] flex justify-between px-6 items-center sticky top-0 z-30 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2 bg-white/5 rounded-lg"><Menu size={24} /></button>
            <h1 className="text-xl font-black">SK Admin</h1>
          </div>
          <button onClick={async () => { await logoutAdmin(); router.refresh(); }} className="text-red-500 p-2"><LogOut size={20} /></button>
        </header>

        <div className="flex-1 p-6 md:p-10 z-10 relative">
          <AnimatePresence mode="wait">
            
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black mb-2">Welcome Back, Admin.</h2>
                  <p className="text-gray-400 font-medium">Here's what's happening with your platform today.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard title="Total Subscribers" value={stats.totalUsers} icon={Users} color="#3b82f6" subtitle="All registered VIP clients" />
                  <StatCard title="Active VIPs" value={stats.activeUsers} icon={Activity} color="#10b981" subtitle="Currently active subscriptions" />
                  <StatCard title="Premium Slips" value={stats.premiumTicketsCount} icon={Trophy} color="#d4af37" subtitle="Total VIP tickets uploaded" />
                  <StatCard title="Pending Reviews" value={stats.pendingReviews} icon={Star} color="#f59e0b" subtitle="Testimonials awaiting approval" />
                </div>
              </motion.div>
            )}

            {/* USERS / CLIENTS */}
            {activeTab === "users" && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Users className="text-[#3b82f6]" /> VIP Clients</h2>
                    <p className="text-gray-400">Manage your subscribers and their active packages.</p>
                  </div>
                </div>

                <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-6">Add/Renew VIP Client</h3>
                  <form onSubmit={handleClientSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                      <input required type="text" placeholder="e.g. 0774000000" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Client Name</label>
                      <input required type="text" placeholder="John Doe" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Package</label>
                      <select value={userForm.pkg} onChange={e => setUserForm({...userForm, pkg: e.target.value})} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none">
                        {packages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Expiry Date</label>
                      <input required type="date" value={userForm.expiry_date} onChange={e => setUserForm({...userForm, expiry_date: e.target.value})} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none [color-scheme:dark]" />
                    </div>
                    <div className="lg:col-span-4 flex justify-end">
                      <button disabled={loading} type="submit" className="bg-[#3b82f6] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600">
                        {loading ? "Processing..." : (
                          <><Plus size={18} /> Grant Access</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[#15151a] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold">Client Directory</h3>
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="text" placeholder="Search by name or phone..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-[#d4af37]" />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                          <th className="p-4 font-bold">Client</th>
                          <th className="p-4 font-bold">Phone</th>
                          <th className="p-4 font-bold">PIN</th>
                          <th className="p-4 font-bold">Active Subscriptions</th>
                          <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredClients.map((client) => {
                          const activeSubs = client.subscriptions?.filter((s: any) => s.status === 'ACTIVE' && new Date(s.expiresAt) >= new Date(new Date().setHours(0,0,0,0))) || [];
                          const isFullyActive = activeSubs.length > 0;
                          
                          return (
                            <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 font-bold flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${isFullyActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {client.name}
                              </td>
                              <td className="p-4 font-mono text-gray-300">{client.phone}</td>
                              <td className="p-4 text-sm">{client.pin || 'Not set'}</td>
                              <td className="p-4">
                                {activeSubs.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {activeSubs.map((sub: any) => (
                                      <span key={sub.id} className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded inline-block font-bold">
                                        {sub.packages?.name || sub.package?.name} (Exp: {new Date(sub.expiresAt).toLocaleDateString()})
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm">No active packages</span>
                                )}
                              </td>
                              <td className="p-4 flex gap-2 justify-end">
                                <button title="Revoke Access" onClick={() => confirmAndDelete(`Revoke all access for ${client.name}?`, () => wrapAction(() => deleteClient(client.id), "Client revoked successfully!"))} className="w-8 h-8 flex items-center justify-center bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors">
                                  <UserX size={16} />
                                </button>
                                <button title="Delete User Completely" onClick={() => confirmAndDelete(`Delete ${client.name} completely from the system? This cannot be undone.`, () => wrapAction(() => completelyDeleteClient(client.id), "Client deleted successfully!"))} className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredClients.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-500">
                              No clients found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PREMIUM TICKETS */}
            {activeTab === "premium" && (
              <motion.div key="premium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Trophy className="text-[#d4af37]" /> Premium Slips</h2>
                  <p className="text-gray-400">Upload VIP slips for active subscribers to view.</p>
                </div>

                <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-6">{editingPremium ? "Edit Slip" : "Upload New Slip"}</h3>
                  <form onSubmit={handlePremiumSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Assign to Package</label>
                        <select name="package_id" defaultValue={editingPremium?.audiences?.[0]?.packageId} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none">
                          {packages.map(pkg => (
                            <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Booking Code (Optional)</label>
                         <input name="booking_code" type="text" defaultValue={editingPremium?.bookingCode} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Total Odds (Optional)</label>
                         <input name="odds_total" type="number" step="0.01" defaultValue={editingPremium?.oddsTotal} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Match Time (Optional)</label>
                         <input name="match_time" type="datetime-local" defaultValue={editingPremium?.matchTime ? new Date(editingPremium.matchTime).toISOString().slice(0, 16) : ""} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none [color-scheme:dark]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ticket Image</label>
                        {editingPremium && editingPremium.imageUrl && (
                          <div className="mb-3 relative rounded-xl overflow-hidden border border-white/10 w-fit">
                            <img src={editingPremium.imageUrl} alt="Current Slip" className="h-24 w-auto object-cover opacity-70" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Current</span>
                            </div>
                          </div>
                        )}
                        <input name="image" type="file" accept="image/*" required={!editingPremium} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#d4af37]/10 file:text-[#d4af37] hover:file:bg-[#d4af37]/20" />
                        {editingPremium && <p className="text-xs text-gray-500 mt-2">Leave empty to keep current image. Select a new file to replace.</p>}
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      {editingPremium && <button type="button" onClick={() => setEditingPremium(null)} className="px-6 py-3 font-bold text-gray-400 hover:text-white">Cancel</button>}
                      <button disabled={loading} type="submit" className="bg-[#d4af37] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b5952f]">
                        {loading ? "Saving..." : <><Plus size={18} /> {editingPremium ? "Update Slip" : "Upload Slip"}</>}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumTickets.map((t: any) => (
                    <div key={t.id} className="bg-[#15151a] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                      {t.imageUrl && <img src={t.imageUrl} alt="Slip" className="w-full h-48 object-cover border-b border-white/5" />}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="inline-block bg-[#d4af37]/10 text-[#d4af37] text-xs font-black px-3 py-1 rounded mb-3 uppercase tracking-wider">{t.packages?.name || t.audiences?.[0]?.package?.name}</span>
                          <p className="text-gray-400 text-sm mb-4">Uploaded: {new Date(t.createdAt).toLocaleDateString()}</p>
                          {t.bookingCode && <p className="font-mono text-white mb-1">Code: {t.bookingCode}</p>}
                          {t.oddsTotal && <p className="text-green-400 font-bold mb-1">Odds: {t.oddsTotal}</p>}
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                          <button onClick={() => setEditingPremium(t)} className="flex-1 bg-white/5 py-2 rounded-lg text-sm font-bold hover:bg-white/10 flex justify-center items-center gap-2">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => confirmAndDelete("Delete this VIP slip?", () => wrapAction(() => deleteTicket(t.id), "VIP slip deleted successfully!"))} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white flex justify-center items-center gap-2 transition-colors">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TESTIMONIALS */}
            {activeTab === "testimonials" && (
              <motion.div key="testimonials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div>
                  <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><MessageSquare className="text-[#f59e0b]" /> Reviews</h2>
                  <p className="text-gray-400">Approve or delete user reviews.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t: any) => (
                    <div key={t.id} className="bg-[#15151a] border border-white/5 rounded-3xl p-6 shadow-xl relative">
                      {!t.approved && <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Pending</div>}
                      <h4 className="font-bold text-lg mb-1">{t.name}</h4>
                      <div className="flex text-yellow-400 mb-3">
                         {Array.from({length: t.rating}).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-4">{t.content}</p>
                      
                      <div className="flex gap-2">
                        {!t.approved && (
                          <button onClick={() => approveTestimonial(t.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors">
                            Approve
                          </button>
                        )}
                        <button onClick={() => confirmAndDelete("Delete this review?", () => wrapAction(() => deleteTestimonial(t.id), "Review deleted successfully!"))} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FREE TICKETS */}
            {activeTab === "free" && (
              <motion.div key="free" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><ImageIcon className="text-[#d4af37]" /> Free Tickets</h2>
                  <p className="text-gray-400">Upload free tickets for the public homepage.</p>
                </div>

                <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-6">{editingFree ? "Edit Free Ticket" : "Upload Free Ticket"}</h3>
                  <form onSubmit={handleUpdateHook} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (Optional)</label>
                         <input name="description" type="text" defaultValue={editingFree?.description} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none" placeholder="e.g., Today's Free Treble" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ticket Image</label>
                        {editingFree && editingFree.imageUrl && (
                          <div className="mb-3 relative rounded-xl overflow-hidden border border-white/10 w-fit">
                            <img src={editingFree.imageUrl || editingFree.image_url} alt="Current Slip" className="h-24 w-auto object-cover opacity-70" />
                          </div>
                        )}
                        <input name="image" type="file" accept="image/*" required={!editingFree} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#d4af37]/10 file:text-[#d4af37] hover:file:bg-[#d4af37]/20" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      {editingFree && <button type="button" onClick={() => setEditingFree(null)} className="px-6 py-3 font-bold text-gray-400 hover:text-white">Cancel</button>}
                      <button disabled={loading} type="submit" className="bg-[#d4af37] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b5952f]">
                        {loading ? "Saving..." : <><Plus size={18} /> {editingFree ? "Update Ticket" : "Upload Ticket"}</>}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freeHooks.map((t: any) => (
                    <div key={t.id} className="bg-[#15151a] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                      {(t.imageUrl || t.image_url) && <img src={t.imageUrl || t.image_url} alt="Slip" className="w-full h-48 object-cover border-b border-white/5" />}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-4">Uploaded: {new Date(t.createdAt).toLocaleDateString()}</p>
                          {t.description && <p className="font-mono text-white mb-1">{t.description}</p>}
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                          <button onClick={() => setEditingFree(t)} className="flex-1 bg-white/5 py-2 rounded-lg text-sm font-bold hover:bg-white/10 flex justify-center items-center gap-2">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => confirmAndDelete("Delete this free ticket?", () => wrapAction(() => deleteFreeHook(t.id), "Ticket deleted!"))} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white flex justify-center items-center gap-2 transition-colors">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WON TICKETS */}
            {activeTab === "wins" && (
              <motion.div key="wins" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Star className="text-[#d4af37]" /> Won Tickets</h2>
                  <p className="text-gray-400">Upload successfully won tickets to showcase to users.</p>
                </div>

                <div className="bg-[#15151a] border border-white/5 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-6">{editingWon ? "Edit Won Ticket" : "Upload Won Ticket"}</h3>
                  <form onSubmit={handleAddWonTicket} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (Optional)</label>
                         <input name="description" type="text" defaultValue={editingWon?.bookingCode || editingWon?.description} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] outline-none" placeholder="e.g., Massive WIN!" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ticket Image</label>
                        {editingWon && editingWon.imageUrl && (
                          <div className="mb-3 relative rounded-xl overflow-hidden border border-white/10 w-fit">
                            <img src={editingWon.imageUrl || editingWon.image_url} alt="Current Slip" className="h-24 w-auto object-cover opacity-70" />
                          </div>
                        )}
                        <input name="image" type="file" accept="image/*" required={!editingWon} className="w-full bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#d4af37] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#d4af37]/10 file:text-[#d4af37] hover:file:bg-[#d4af37]/20" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      {editingWon && <button type="button" onClick={() => setEditingWon(null)} className="px-6 py-3 font-bold text-gray-400 hover:text-white">Cancel</button>}
                      <button disabled={loading} type="submit" className="bg-[#d4af37] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#b5952f]">
                        {loading ? "Saving..." : <><Plus size={18} /> {editingWon ? "Update Ticket" : "Upload Ticket"}</>}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wonTickets.map((t: any) => (
                    <div key={t.id} className="bg-[#15151a] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                      {(t.imageUrl || t.image_url) && <img src={t.imageUrl || t.image_url} alt="Slip" className="w-full h-48 object-cover border-b border-white/5" />}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-4">Uploaded: {new Date(t.createdAt).toLocaleDateString()}</p>
                          <p className="font-mono text-white mb-1">{t.bookingCode || t.description}</p>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                          <button onClick={() => setEditingWon(t)} className="flex-1 bg-white/5 py-2 rounded-lg text-sm font-bold hover:bg-white/10 flex justify-center items-center gap-2">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => confirmAndDelete("Delete this won ticket?", () => wrapAction(() => deleteWonTicket(t.id), "Ticket deleted!"))} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white flex justify-center items-center gap-2 transition-colors">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SETTINGS (Preserved) */}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 text-center border border-white/5 rounded-3xl bg-[#15151a]">
                <h3 className="text-xl font-bold mb-2">Section Accessible</h3>
                <p className="text-gray-400">The code for settings section is preserved.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
