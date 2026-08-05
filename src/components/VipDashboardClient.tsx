"use client";
/* eslint-disable @next/next/no-img-element */
import { User, Ticket, Subscription, Package } from '@prisma/client';
import { useRouter } from "next/navigation";
import { LogOut, Trophy, CheckCircle, Clock } from "lucide-react";
import { logoutVip } from "@/app/actions";

type SubWithPackage = Subscription & { packages: Package };
type TicketWithPackage = Ticket & { packages: Package };

export default function VipDashboardClient({ user, subscriptions, tickets }: { user: User, subscriptions: SubWithPackage[], tickets: TicketWithPackage[] }) {
  const router = useRouter();
  const handleLogout = async () => {
    await logoutVip();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0f0a14] text-white">
      {/* HEADER */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-[#1a1525] border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="SK Sure Wins Logo" className="h-10 w-auto object-contain rounded-md" />
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-tight tracking-tight">VIP Dashboard</h1>
            <p className="text-[10px] text-[#25D366] uppercase tracking-widest font-bold">VIP MEMBER</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-bold text-sm bg-red-400/10 px-4 py-2 rounded-lg">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-[#1a1525] to-[#120d1d] border border-white/10 rounded-3xl p-8 mb-10 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#25D366]/20 blur-[60px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            Welcome back, {user.name} <span className="text-[#25D366]">👋</span>
          </h2>
          <p className="text-gray-400 max-w-lg mb-6">
            You are currently subscribed to {subscriptions.length} active package(s). Below are your premium tickets.
          </p>

          <div className="flex flex-wrap gap-2">
            {subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 px-4 py-2 rounded-xl text-sm font-bold text-[#25D366]">
                <Clock size={16} /> 
                {sub.packages.name} (Active until {new Date(sub.expiresAt).toLocaleDateString()})
              </div>
            ))}
          </div>
        </div>

        {/* TODAY'S TICKETS */}
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
          <Trophy className="text-yellow-400" /> Your Premium Tickets
        </h3>
        
        {tickets.length > 0 ? (
          <div className="grid gap-6">
            {tickets.map((ticket: Ticket) => (
              <div key={ticket.id} className="bg-[#1a1525] border border-primary/10 rounded-3xl p-6 shadow-xl hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded uppercase">
                    {ticket.packages.name}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                
                {ticket.matchTime && (
                  <p className="text-sm font-bold text-gray-400 mb-2">Match Time: {new Date(ticket.matchTime).toLocaleString()}</p>
                )}
                
                {ticket.oddsTotal && (
                  <p className="text-xl font-black text-[#25D366] mb-4">Total Odds: {ticket.oddsTotal}</p>
                )}

                {ticket.bookingCode && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-4 text-center">
                    <span className="block text-xs text-gray-400 uppercase tracking-widest mb-3 font-mono">Booking Code / Match Link</span>
                    {ticket.bookingCode.startsWith('http') ? (
                      <a href={ticket.bookingCode} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 px-6 py-3 rounded-lg font-bold text-base transition-all border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] break-all max-w-full text-left">
                        🔗 {ticket.bookingCode}
                      </a>
                    ) : (
                      <span className="text-2xl font-black text-white font-mono">{ticket.bookingCode}</span>
                    )}
                  </div>
                )}

                {ticket.imageUrl && (
                  <img src={ticket.imageUrl} alt="Premium Ticket" className="w-full rounded-2xl border border-white/10 mb-4 object-contain max-h-[500px]" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1a1525] border border-white/5 rounded-3xl p-10 text-center shadow-xl">
            <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-400/30">
              <CheckCircle className="text-yellow-400" size={40} />
            </div>
            <h4 className="text-2xl font-black text-white mb-3">Tickets are being finalized!</h4>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
              Our expert analysts are currently verifying the safest odds for your packages. The premium slips will appear here shortly. Please check back in a few hours.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
