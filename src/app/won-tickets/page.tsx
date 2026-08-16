/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
export const revalidate = 3600;

import { getWonTickets } from '@/app/actions';
import Navbar from '@/components/Navbar';
import { Trophy } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Winning Receipts - SK Sure Wins',
  description: 'View our past winning receipts and betting history.',
};
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
          {tickets.map((ticket: any) => (
            <div key={ticket.id} className="bg-gradient-to-br from-[#2a133d] to-[#12071a] p-8 rounded-2xl border border-primary/20 flex flex-col gap-6 shadow-[0_10px_30px_rgba(234,179,8,0.1)]">
              <div className="w-full flex justify-between items-center mb-2">
                 <span className="bg-[#25D366]/20 text-[#25D366] text-xs font-bold px-3 py-1 rounded-md uppercase border border-[#25D366]/30">Winning Ticket</span>
                <span className="text-gray-500 text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              
              {ticket.imageUrl ? (
                <Image src={ticket.imageUrl} alt="Receipt" width={800} height={500} className="w-full h-auto object-cover rounded-xl border border-white/10 max-h-[500px]" />
              ) : (
                <div className="w-full h-48 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center">
                  <Trophy size={48} className="text-primary/50" />
                </div>
              )}
              
              {(ticket.bookingCode || ticket.description) && (
                <div className="w-full mt-4 text-white text-xl font-bold bg-black/30 p-6 rounded-xl border border-white/5 text-center flex justify-center">
                  {((ticket.bookingCode || ticket.description).startsWith('http://') || (ticket.bookingCode || ticket.description).startsWith('https://')) ? (
                    <a href={ticket.bookingCode || ticket.description} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30 hover:text-[#f9d976] px-6 py-3 rounded-xl font-bold transition-all border border-[#d4af37]/30 break-all text-left w-full md:w-auto shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                      🔗 {ticket.bookingCode || ticket.description}
                    </a>
                  ) : (
                    <p className="text-gray-100">{ticket.bookingCode || ticket.description}</p>
                  )}
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
