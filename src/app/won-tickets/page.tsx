export const dynamic = 'force-dynamic';

import { getWonTickets } from '@/app/actions';
import Navbar from '@/components/Navbar';
import { Trophy } from 'lucide-react';

export default async function WonTicketsPage() {
  const tickets = await getWonTickets();

  return (
    <div className="min-h-screen bg-[#0f0a14] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-24 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-12 text-center">
          Winning <span className="text-primary">Receipts</span>
        </h1>
        
        <div className="grid gap-8">
          {tickets.slice().reverse().map((ticket: any) => (
            <div key={ticket.id} className="bg-gradient-to-br from-[#2a133d] to-[#12071a] p-8 rounded-2xl border border-primary/20 flex flex-col gap-6 shadow-[0_10px_30px_rgba(234,179,8,0.1)]">
              <div className="w-full flex justify-between items-center mb-2">
                 <span className="bg-[#25D366]/20 text-[#25D366] text-xs font-bold px-3 py-1 rounded-md uppercase border border-[#25D366]/30">Winning Ticket</span>
                <span className="text-gray-500 text-sm">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              
              {ticket.image_url ? (
                <img src={ticket.image_url} alt="Receipt" className="w-full h-auto object-cover rounded-xl border border-white/10 max-h-[500px]" />
              ) : (
                <div className="w-full h-48 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center">
                  <Trophy size={48} className="text-primary/50" />
                </div>
              )}
              
              {ticket.description && (
                <div className="w-full mt-4 text-white text-xl font-bold bg-black/30 p-6 rounded-xl border border-white/5">
                  <p className="text-gray-100">{ticket.description}</p>
                </div>
              )}
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="text-gray-400 font-bold text-center p-12 bg-black/30 rounded-xl border border-white/5">
              No winning receipts have been uploaded yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
