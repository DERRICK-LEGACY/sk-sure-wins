"use client";

import { useState } from "react";
import { updateFreeHook, addWonTicket, deleteWonTicket, addUser, deleteUser, editFreeHook, editWonTicket, editUser, deleteFreeHook, addPremiumTicket, editPremiumTicket, deletePremiumTicket, logoutAdmin, approveTestimonial, deleteTestimonial, updateAdminCredentials } from "@/app/actions";
import { Search, UserCheck, UserX, Edit2, Trash2, X, Plus, Image as ImageIcon, LogOut, Trophy, AlertTriangle, MessageSquare, CheckCircle, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

// Confirmation Dialog
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1525] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="text-red-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Are you sure?</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ freeHooks, wonTickets, users, premiumTickets, testimonials = [] }: { freeHooks: any[], wonTickets: any[], users: any[], premiumTickets: any[], testimonials?: any[] }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("free");
  const router = useRouter();

  // User Search
  const [userSearch, setUserSearch] = useState("");

  // Edit States
  const [editingFree, setEditingFree] = useState<any>(null);
  const [editingWon, setEditingWon] = useState<any>(null);
  const [editingUserState, setEditingUserState] = useState<any>(null);
  const [editingPremium, setEditingPremium] = useState<any>(null);

  // Delete Confirmation
  const [confirmDelete, setConfirmDelete] = useState<{ message: string, action: () => void } | null>(null);

  // User form state
  const [userForm, setUserForm] = useState({ phone: "", name: "", pkg: "Gold: VIP", expiry_date: "" });

  // Premium ticket form
  const [premiumTier, setPremiumTier] = useState("Bronze");

  // === HANDLERS ===
  const handleUpdateHook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (editingFree) {
      await editFreeHook(editingFree.id, formData);
      setEditingFree(null);
    } else {
      await updateFreeHook(formData);
    }
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  const handleAddTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (editingWon) {
      await editWonTicket(editingWon.id, formData);
      setEditingWon(null);
    } else {
      await addWonTicket(formData);
    }
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingUserState) {
      await editUser(editingUserState.id, userForm);
      setEditingUserState(null);
    } else {
      await addUser(userForm);
    }
    setUserForm({ phone: "", name: "", pkg: "Gold: VIP", expiry_date: "" });
    setLoading(false);
  };

  const handlePremiumSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (editingPremium) {
      await editPremiumTicket(editingPremium.id, formData);
      setEditingPremium(null);
    } else {
      await addPremiumTicket(formData);
    }
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  const startEditUser = (u: any) => {
    setEditingUserState(u);
    setUserForm({ phone: u.phone, name: u.name, pkg: u.package, expiry_date: u.expiry_date });
  };

  const cancelEditUser = () => {
    setEditingUserState(null);
    setUserForm({ phone: "", name: "", pkg: "Gold: VIP", expiry_date: "" });
  };

  const handleDeleteTestimonial = async (id: string) => {
    setConfirmDelete({
      message: "Are you sure you want to permanently delete this testimonial?",
      action: async () => {
        setLoading(true);
        await deleteTestimonial(id);
        setLoading(false);
      }
    });
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  const confirmAndDelete = (message: string, action: () => void) => {
    setConfirmDelete({ message, action });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.phone.includes(userSearch)
  );

  return (
    <div className="min-h-screen bg-[#0f0a14] text-white flex flex-col md:flex-row">

      {/* CONFIRM DIALOG */}
      {confirmDelete && (
        <ConfirmDialog 
          message={confirmDelete.message} 
          onConfirm={() => { confirmDelete.action(); setConfirmDelete(null); }} 
          onCancel={() => setConfirmDelete(null)} 
        />
      )}

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#120d1d] border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-4 shrink-0 relative md:fixed md:h-full z-20">
        <div className="flex items-center justify-between md:justify-start gap-3 mb-4 md:mb-10 mt-0 md:mt-4 px-2">
          <div className="flex items-center gap-3">
            <img src="/sklogo.jpeg" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-[#25D366]" />
            <h1 className="text-lg md:text-xl font-black tracking-tight">SK Admin</h1>
          </div>
          <div className="md:hidden">
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 p-2"><LogOut size={20} /></button>
          </div>
        </div>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          <button onClick={() => setActiveTab("free")} className={`shrink-0 whitespace-nowrap text-left px-4 py-3 rounded-lg font-bold transition-all ${activeTab === "free" ? "bg-[#25D366] text-black shadow-[0_0_15px_rgba(37,211,102,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>Free Tickets</button>
          <button onClick={() => setActiveTab("wins")} className={`shrink-0 whitespace-nowrap text-left px-4 py-3 rounded-lg font-bold transition-all ${activeTab === "wins" ? "bg-[#25D366] text-black shadow-[0_0_15px_rgba(37,211,102,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>News & Tickets</button>
          <button onClick={() => setActiveTab("premium")} className={`shrink-0 whitespace-nowrap text-left px-4 py-3 rounded-lg font-bold transition-all ${activeTab === "premium" ? "bg-primary text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>⭐ Premium</button>
          <button onClick={() => setActiveTab("users")} className={`shrink-0 whitespace-nowrap text-left px-4 py-3 rounded-lg font-bold transition-all ${activeTab === "users" ? "bg-[#25D366] text-black shadow-[0_0_15px_rgba(37,211,102,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>Manage VIPs</button>
          <button onClick={() => setActiveTab("testimonials")} className={`shrink-0 whitespace-nowrap text-left px-4 py-3 rounded-lg font-bold transition-all ${activeTab === "testimonials" ? "bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>💬 Reviews</button>
          <button onClick={() => setActiveTab("settings")} className={`shrink-0 whitespace-nowrap text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === "settings" ? "bg-gray-700 text-white shadow-[0_0_15px_rgba(55,65,81,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
            <Settings size={18} /> Settings
          </button>
        </nav>
        
        <div className="mt-auto hidden md:block">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 border border-red-900/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 px-4 py-3 rounded-lg font-bold transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 md:ml-64 min-h-screen">
        
        {/* === FREE TICKETS === */}
        {activeTab === "free" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#1a1525] border border-white/5 p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366] blur-[100px] opacity-20 pointer-events-none"></div>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                {editingFree ? "Edit Free Ticket" : "Post New Free Ticket"}
                {editingFree && <button onClick={() => setEditingFree(null)} className="text-sm bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20">Cancel Edit</button>}
              </h2>
              
              <form onSubmit={handleUpdateHook} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Description / Match Details</label>
                  <textarea name="description" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] outline-none transition-all min-h-[120px]" placeholder="Write a description about this free ticket..." defaultValue={editingFree?.description || ""} required />
                </div>
                <div className="bg-black/50 p-6 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Ticket Image</label>
                    <p className="text-xs text-gray-500 mb-4">{editingFree ? "Upload a new image to replace the current one (optional)" : "Upload the ticket screenshot"}</p>
                    <input type="file" name="image" accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#25D366] file:text-black hover:file:bg-[#1da851] cursor-pointer transition-colors" required={!editingFree} />
                  </div>
                  {editingFree?.image_url && <img src={editingFree.image_url} alt="Current" className="w-20 h-20 rounded-lg object-cover border border-white/10" />}
                </div>
                <button disabled={loading} type="submit" className="w-full bg-[#25D366] text-black font-black py-4 rounded-xl hover:bg-[#1da851] hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> {editingFree ? "SAVE CHANGES" : "POST FREE TICKET"}
                </button>
              </form>
            </div>

            <div className="bg-[#1a1525] border border-white/5 p-8 rounded-2xl shadow-xl">
              <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-[#25D366]"/> Recent Free Tickets</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {freeHooks.map(h => (
                  <div key={h.id} className={`flex justify-between items-center bg-black/40 p-4 rounded-xl border ${h.is_active ? 'border-[#25D366]/30' : 'border-white/5'} hover:border-white/20 transition-all`}>
                    <div className="flex items-center gap-4 w-full">
                      {h.image_url ? (
                        <img src={h.image_url} alt="Ticket" className="w-16 h-16 object-cover rounded-lg bg-black border border-white/10 shrink-0" />
                      ) : (
                         <div className="w-16 h-16 rounded-lg bg-black border border-white/10 flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-gray-600"/></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {h.is_active === 1 && <span className="bg-[#25D366]/20 text-[#25D366] text-[10px] font-black px-2 py-0.5 rounded uppercase">Active</span>}
                          <span className="text-xs text-gray-500">{new Date(h.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-gray-300 truncate">{h.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button onClick={() => setEditingFree(h)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => confirmAndDelete("This will permanently delete this free ticket.", () => deleteFreeHook(h.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {freeHooks.length === 0 && <div className="text-gray-500 text-center py-8 bg-black/20 rounded-xl border border-white/5">No free tickets posted yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* === WON TICKETS === */}
        {activeTab === "wins" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#1a1525] border border-white/5 p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[100px] opacity-20 pointer-events-none"></div>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                {editingWon ? "Edit Item" : "Post News or Winning Receipt"}
                {editingWon && <button onClick={() => setEditingWon(null)} className="text-sm bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20">Cancel Edit</button>}
              </h2>
              
              <form onSubmit={handleAddTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Description / Match Details</label>
                  <textarea name="description" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[120px]" placeholder="Describe this winning ticket..." defaultValue={editingWon?.description || ""} required />
                </div>
                <div className="bg-black/50 p-6 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Receipt Image (Optional for News)</label>
                    <p className="text-xs text-gray-500 mb-4">{editingWon ? "Upload a new image to replace (optional)" : "Leave empty to post a text-only News item"}</p>
                    <input type="file" name="image" accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-[#d4af37] cursor-pointer transition-colors" />
                  </div>
                  {editingWon?.image_url && <img src={editingWon.image_url} alt="Current" className="w-20 h-20 rounded-lg object-cover border border-white/10" />}
                </div>
                <button disabled={loading} type="submit" className="w-full bg-primary text-black font-black py-4 rounded-xl hover:bg-[#d4af37] hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> {editingWon ? "SAVE CHANGES" : "UPLOAD WINNING RECEIPT"}
                </button>
              </form>
            </div>

            <div className="bg-[#1a1525] border border-white/5 p-8 rounded-2xl shadow-xl">
              <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-primary"/> Recent Wins Database</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {wonTickets.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 w-full">
                      {t.image_url ? (
                        <img src={t.image_url} alt="Receipt" className="w-16 h-16 object-cover rounded-lg bg-black border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-black border border-white/10 flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-gray-600"/></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-500 mb-1 block">{new Date(t.created_at).toLocaleDateString()}</span>
                        <div className="text-sm text-gray-300 truncate">{t.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button onClick={() => setEditingWon(t)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => confirmAndDelete("This will permanently delete this winning receipt.", () => deleteWonTicket(t.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {wonTickets.length === 0 && <div className="text-gray-500 text-center py-8 bg-black/20 rounded-xl border border-white/5">No winning tickets uploaded yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* === PREMIUM TICKETS === */}
        {activeTab === "premium" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#1a1525] border border-primary/20 p-8 rounded-2xl shadow-[0_15px_40px_rgba(234,179,8,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[100px] opacity-30 pointer-events-none"></div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <Trophy className="text-primary" size={28} />
                {editingPremium ? "Edit Premium Ticket" : "Upload Premium VIP Ticket"}
                {editingPremium && <button onClick={() => setEditingPremium(null)} className="text-sm bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20">Cancel Edit</button>}
              </h2>
              <p className="text-gray-400 text-sm mb-6">Upload the daily VIP slips here. Only users who paid for the matching tier will see them.</p>
              
              <form onSubmit={handlePremiumSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Package Tier</label>
                  <select name="package_tier" defaultValue={editingPremium?.package_tier || "Bronze"} className="w-full bg-black/50 border border-white/10 p-3.5 rounded-xl text-white focus:border-primary outline-none transition-colors">
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium Offers</option>
                    <option value="Life Changer">Life Changer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Description / Match Details</label>
                  <textarea name="description" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[120px]" placeholder="Describe the premium ticket (e.g. 'Man Utd vs Chelsea - Over 2.5 Goals')" defaultValue={editingPremium?.description || ""} required />
                </div>
                <div className="bg-black/50 p-6 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Ticket Image</label>
                    <p className="text-xs text-gray-500 mb-4">{editingPremium ? "Upload a new image to replace (optional)" : "Upload the VIP slip screenshot"}</p>
                    <input type="file" name="image" accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-[#d4af37] cursor-pointer transition-colors" required={!editingPremium} />
                  </div>
                  {editingPremium?.image_url && <img src={editingPremium.image_url} alt="Current" className="w-20 h-20 rounded-lg object-cover border border-white/10" />}
                </div>
                <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-primary to-[#d4af37] text-black font-black py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(234,179,8,0.3)]">
                  <Plus size={20} /> {editingPremium ? "SAVE CHANGES" : "UPLOAD PREMIUM TICKET"}
                </button>
              </form>
            </div>

            <div className="bg-[#1a1525] border border-white/5 p-8 rounded-2xl shadow-xl">
              <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2"><Trophy size={20} className="text-primary"/> Premium Tickets Database</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {premiumTickets.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 w-full">
                      {t.image_url ? (
                        <img src={t.image_url} alt="Premium" className="w-16 h-16 object-cover rounded-lg bg-black border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-black border border-white/10 flex items-center justify-center shrink-0"><Trophy size={20} className="text-gray-600"/></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase">{t.package_tier}</span>
                          <span className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-gray-300 truncate">{t.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button onClick={() => setEditingPremium(t)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => confirmAndDelete("This will permanently delete this premium ticket.", () => deletePremiumTicket(t.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {premiumTickets.length === 0 && <div className="text-gray-500 text-center py-8 bg-black/20 rounded-xl border border-white/5">No premium tickets uploaded yet. Upload your first VIP slip above!</div>}
              </div>
            </div>
          </div>
        )}

        {/* === USER MANAGEMENT === */}
        {activeTab === "users" && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="bg-gradient-to-br from-[#1a1525] to-[#120d1d] border border-white/10 p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <h2 className="text-2xl font-black mb-6 text-white flex items-center gap-3">
                {editingUserState ? <><Edit2 size={24} className="text-[#25D366]"/> Edit VIP Subscriber</> : <><UserCheck size={24} className="text-[#25D366]"/> Add New VIP Subscriber</>}
              </h2>
              <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <input className="w-full bg-black/50 border border-white/10 p-3.5 rounded-xl text-white focus:border-[#25D366] outline-none transition-colors" placeholder="e.g. 0774 032 355" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <input className="w-full bg-black/50 border border-white/10 p-3.5 rounded-xl text-white focus:border-[#25D366] outline-none transition-colors" placeholder="e.g. John Doe" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Package</label>
                  <select className="w-full bg-black/50 border border-white/10 p-3.5 rounded-xl text-white focus:border-[#25D366] outline-none transition-colors" value={userForm.pkg} onChange={e => setUserForm({...userForm, pkg: e.target.value})}>
                    <optgroup label="Bronze Odds">
                      <option value="Bronze: ODD 1.5 Normal">Bronze: ODD 1.5 Normal (10k)</option>
                      <option value="Bronze: ODD 1.2">Bronze: ODD 1.2 (20k)</option>
                      <option value="Bronze: ODD 3">Bronze: ODD 3 (30k)</option>
                      <option value="Bronze: ODD 4">Bronze: ODD 4 (40k)</option>
                      <option value="Bronze: ODD 5">Bronze: ODD 5 (50k)</option>
                    </optgroup>
                    <optgroup label="Silver Odds">
                      <option value="Silver: ODD 8-10">Silver: ODD 8-10 (60k)</option>
                      <option value="Silver: PROBLEM SOLVER">Silver: PROBLEM SOLVER (70k)</option>
                      <option value="Silver: ODD 20">Silver: ODD 20 (100k)</option>
                      <option value="Silver: AKATAMBULA">Silver: AKATAMBULA (50k)</option>
                    </optgroup>
                    <optgroup label="Gold Odds">
                      <option value="Gold: VIP">Gold: VIP (50k)</option>
                      <option value="Gold: VVIP">Gold: VVIP (60k)</option>
                      <option value="Gold: FAMILY">Gold: FAMILY (80k)</option>
                      <option value="Gold: BIG STAKERS">Gold: BIG STAKERS (100k)</option>
                      <option value="Gold: SERIOUS BETTORS">Gold: SERIOUS BETTORS (300k)</option>
                    </optgroup>
                    <optgroup label="Premium Offers">
                      <option value="Premium: Rent Project">Premium: Rent Project (40k)</option>
                      <option value="Premium: Boda boda Project">Premium: Boda boda Project (40k)</option>
                      <option value="Premium: Back to school Project">Premium: Back to school Project (40k)</option>
                      <option value="Premium: 1M in 5 days">Premium: 1M in 5 days (40k)</option>
                    </optgroup>
                    <optgroup label="Life Changers">
                      <option value="Life Changer: ODD 1.20">Life Changer: ODD 1.20 (30k)</option>
                      <option value="Life Changer: ODD 1.30">Life Changer: ODD 1.30 (30k)</option>
                      <option value="Life Changer: ODD 1.50">Life Changer: ODD 1.50 (30k)</option>
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expiry Date</label>
                  <input type="date" className="w-full bg-black/50 border border-white/10 p-3.5 rounded-xl text-white focus:border-[#25D366] outline-none transition-colors" value={userForm.expiry_date} onChange={e => setUserForm({...userForm, expiry_date: e.target.value})} required />
                </div>
                <div className="flex gap-2">
                  <button disabled={loading} type="submit" className="flex-1 bg-[#25D366] text-black font-black py-3.5 rounded-xl hover:bg-[#1da851] transition-colors shadow-lg">
                    {editingUserState ? "SAVE" : "ADD"}
                  </button>
                  {editingUserState && (
                    <button type="button" onClick={cancelEditUser} className="bg-white/10 text-white p-3.5 rounded-xl hover:bg-white/20 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-[#1a1525] border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/20">
                <h3 className="text-xl font-bold text-white">VIP Subscriber Database <span className="text-sm font-normal text-gray-500 ml-2">({filteredUsers.length} total)</span></h3>
                <div className="relative w-full sm:w-72">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" placeholder="Search by name or phone..." className="w-full bg-black border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:border-[#25D366] outline-none transition-colors" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
                      <th className="p-5 font-bold">Client Info</th>
                      <th className="p-5 font-bold">Subscription</th>
                      <th className="p-5 font-bold">Status</th>
                      <th className="p-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => {
                      const isExpired = new Date(u.expiry_date) < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="p-5">
                            <div className="font-bold text-white text-base">{u.name}</div>
                            <div className="text-gray-500 text-sm mt-0.5">{u.phone}</div>
                          </td>
                          <td className="p-5">
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black tracking-wide">
                              {u.package}
                            </div>
                            <div className="text-gray-500 text-xs mt-2 font-medium">Expires: <span className="text-gray-300">{u.expiry_date}</span></div>
                          </td>
                          <td className="p-5">
                            {isExpired ? (
                              <div className="inline-flex items-center gap-1.5 text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Expired
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 text-[#25D366] bg-[#25D366]/10 px-3 py-1 rounded-full text-xs font-bold border border-[#25D366]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span> Active
                              </div>
                            )}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditUser(u)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit User"><Edit2 size={18} /></button>
                              <button onClick={() => confirmAndDelete(`This will permanently delete ${u.name}'s VIP access.`, () => deleteUser(u.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Revoke Access"><UserX size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-gray-500 bg-black/10">
                          <div className="flex flex-col items-center justify-center">
                            <UserX size={48} className="text-gray-700 mb-4" />
                            <p className="font-bold text-lg text-gray-400">No VIP subscribers found.</p>
                            {userSearch && <p className="text-sm mt-1">Try adjusting your search filters.</p>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* === TESTIMONIALS === */}
        {activeTab === "testimonials" && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-[#1a1525] border border-white/5 p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[100px] opacity-20 pointer-events-none"></div>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">Manage Testimonials</h2>
              
              <div className="space-y-4">
                {testimonials.length === 0 ? (
                  <p className="text-gray-400">No testimonials yet.</p>
                ) : (
                  testimonials.map(t => (
                    <div key={t.id} className="bg-black/50 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-white text-lg">{t.name}</h4>
                          <span className="flex text-primary">{"★".repeat(t.rating)}</span>
                          {t.approved ? (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Approved</span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Pending</span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm italic">"{t.content}"</p>
                        <p className="text-gray-500 text-xs mt-2">{new Date(t.created_at).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <button disabled={loading} onClick={() => handleDeleteTestimonial(t.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg font-bold transition-colors">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {/* === SETTINGS === */}
        {activeTab === "settings" && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <Settings className="text-gray-400" size={32} /> Admin Settings
            </h2>
            <div className="bg-[#1a1525] p-6 rounded-2xl border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Change Admin Password</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const pwd = (e.currentTarget.elements.namedItem("newPassword") as HTMLInputElement).value;
                const res = await updateAdminCredentials(pwd);
                setLoading(false);
                if (res.error) {
                  alert("Error: " + res.error);
                } else {
                  alert("Password updated successfully!");
                  (e.target as HTMLFormElement).reset();
                }
              }} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">New Password (Min 6 chars)</label>
                  <input type="password" name="newPassword" required minLength={6} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#25D366] transition-colors" placeholder="Enter new password..." />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#25D366] text-black font-black py-3 rounded-xl hover:bg-[#1fad53] transition-colors disabled:opacity-50 mt-2">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
