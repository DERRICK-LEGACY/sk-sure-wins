"use client";
import { User, Ticket, Subscription, Package } from '@prisma/client';
import { useRouter } from "next/navigation";
import { LogOut, Trophy, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { logoutVip } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import EnableNotificationsBanner from "./EnableNotificationsBanner";
type SubWithPackage = Subscription & { package: Package };
type TicketWithPackage = Ticket & { audiences: { package: Package }[] };

export default function VipDashboardClient({ 
  user, 
  subscriptions, 
  tickets,
  isExpired,
  daysRemaining 
}: { 
  user: User, 
  subscriptions: SubWithPackage[], 
  tickets: TicketWithPackage[],
  isExpired?: boolean,
  daysRemaining?: number | null
}) {
  const router = useRouter();
  const handleLogout = async () => {
    await logoutVip();
    router.push("/login");
    router.refresh();
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>

        {/* HEADER */}
        <header className="w-full py-4 px-6 flex justify-between items-center bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-lg blur opacity-30"></div>
              <Image src="/sklogo.jpeg" alt="SK Sure Wins Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-lg relative z-10 border border-white/10 shadow-lg bg-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl leading-tight tracking-tight text-white ">VIP Dashboard</h1>
              <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">EXPIRED</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-bold text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="glass-panel bg-[#0A0A0F]/90 backdrop-blur-2xl border border-red-500/30 rounded-[2.5rem] p-10 text-center shadow-[0_30px_60px_rgba(239,68,68,0.15)] max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping opacity-30"></div>
              <Clock className="text-red-500" size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Access Expired</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Your VIP access has expired. Renew your subscription to regain access to our premium odds, tickets, and analysis.
            </p>
            <Link href="/#packages" className="inline-block w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-extrabold py-4 rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg">
              Renew VIP Access
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#25D366]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      {/* HEADER */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40 relative">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#D4AF37] rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <Image src="/sklogo.jpeg" alt="SK Sure Wins Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-lg relative z-10 border border-white/20 shadow-xl bg-black" />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-tight tracking-tight text-white ">VIP Dashboard</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse shadow-[0_0_5px_#25D366]"></span>
              <p className="text-[10px] text-[#25D366] uppercase tracking-widest font-black drop-shadow-sm">VERIFIED MEMBER</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-bold text-sm bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <LogOut size={16} /> <span className="hidden sm:inline">Secure Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
        {/* WARNING BANNER */}
        {daysRemaining !== null && daysRemaining !== undefined && daysRemaining <= 3 && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-[0_0_20px_rgba(234,179,8,0.15)] backdrop-blur-md">
            <div className="bg-yellow-500/20 p-2 rounded-full border border-yellow-500/30">
              <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
            </div>
            <div>
              <h4 className="text-yellow-500 font-black text-lg tracking-tight">Subscription Expiring Soon!</h4>
              <p className="text-sm text-yellow-500/80 mt-1 font-medium">
                Your VIP access expires in {daysRemaining} day{daysRemaining === 1 ? '' : 's'}. <Link href="/#packages" className="underline font-bold text-yellow-400 hover:text-yellow-300">Renew now</Link> to secure your spot.
              </p>
            </div>
          </div>
        )}

        {/* WELCOME BANNER */}
        <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#25D366] to-transparent opacity-80"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#25D366]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#25D366]/20 transition-all duration-700"></div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-3 flex items-center gap-3 text-white tracking-tight">
            Welcome back, {user.name} <span className="text-[#25D366] animate-bounce duration-1000">👋</span>
          </h2>
          <p className="text-gray-400 max-w-lg mb-8 text-base md:text-lg font-medium">
            You are currently subscribed to {subscriptions.length} active premium package(s).
          </p>

          <div className="flex flex-wrap gap-3">
            {subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center gap-2 bg-[#25D366]/5 border border-[#25D366]/30 px-5 py-2.5 rounded-xl text-sm font-bold text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.1)] backdrop-blur-md">
                <Clock size={16} className="opacity-80" /> 
                {sub.package.name} <span className="text-[#25D366]/60 font-medium ml-1">(Active until {new Date(sub.expiresAt).toLocaleDateString()})</span>
              </div>
            ))}
          </div>
        </div>

        <EnableNotificationsBanner userId={user.id} />

        {/* TODAY'S TICKETS */}
        <h3 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-4 border-b border-white/10 pb-6 text-white tracking-tight">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl flex items-center justify-center border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Trophy className="text-[#D4AF37]" size={24} />
          </div>
          Your Premium Tickets
        </h3>
        
        {tickets.length > 0 ? (
          <div className="grid gap-8">
            {tickets.map((ticket: TicketWithPackage) => (
              <div key={ticket.id} className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-[#D4AF37]/20 rounded-[2.5rem] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-[#D4AF37]/50 transition-all hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black text-xs font-black px-4 py-1.5 rounded-full uppercase shadow-md flex items-center gap-2">
                    <CheckCircle size={14} /> {ticket.audiences[0]?.package.name}
                  </span>
                  <span className="text-sm text-gray-400 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/10">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                
                {ticket.matchTime && (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3 bg-white/5 w-max px-4 py-2 rounded-xl border border-white/5 relative z-10">
                    <Clock size={16} className="text-[#D4AF37]" />
                    Match Time: {new Date(ticket.matchTime).toLocaleString()}
                  </div>
                )}
                
                {ticket.oddsTotal && (
                  <p className="text-2xl font-black text-[#25D366] mb-6 relative z-10 flex items-center gap-2">
                    <span className="text-white/40 font-medium text-lg">Total Odds:</span> {ticket.oddsTotal}
                  </p>
                )}

                {ticket.bookingCode && (
                  <div className="bg-black/50 border border-white/10 p-5 md:p-6 rounded-2xl mb-6 text-center relative z-10">
                    <span className="block text-xs text-[#D4AF37] font-black uppercase tracking-widest mb-3">Booking Code / Match Link</span>
                    {ticket.bookingCode.startsWith('http') ? (
                      <a href={ticket.bookingCode} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:brightness-110 px-6 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] break-all max-w-full w-full">
                        <span className="text-2xl">🔗</span> View Premium Match Link
                      </a>
                    ) : (
                      <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-widest drop-shadow-md">{ticket.bookingCode}</span>
                    )}
                  </div>
                )}

                {ticket.imageUrl && (
                  <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/40">
                    <Image src={ticket.imageUrl} alt="Premium Ticket" width={800} height={500} className="w-full object-contain max-h-[500px] hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.2)] relative z-10">
              <div className="absolute inset-0 bg-yellow-400/10 rounded-full animate-ping opacity-30"></div>
              <CheckCircle className="text-yellow-400" size={48} strokeWidth={1.5} />
            </div>
            <h4 className="text-3xl font-black text-white mb-4 tracking-tight relative z-10">Tickets are being finalized!</h4>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-lg relative z-10">
              Our expert analysts are currently verifying the safest odds for your packages. The premium slips will appear here shortly. Please check back in a few hours.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
