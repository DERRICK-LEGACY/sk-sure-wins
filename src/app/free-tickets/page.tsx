export const dynamic = 'force-dynamic';

import { getAllFreeHooks } from '@/app/actions';
import Navbar from '@/components/Navbar';
import { Clock } from 'lucide-react';

export default async function FreeTicketsPage() {
  const hooks = await getAllFreeHooks();

  return (
    <div className="min-h-screen bg-[#0f0a14] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-24 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-12 text-center">
          <span className="text-[#25D366]">Free Tickets</span> History
        </h1>
        
        <div className="grid gap-6">
          {hooks.map((hook: any) => (
            <div key={hook.id} className="bg-gradient-to-br from-[#1a1525] to-[#0f0a14] p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-6 shadow-xl">
              <div className="w-full flex justify-between items-center mb-2">
                {hook.is_active ? (
                   <span className="bg-[#25D366] text-black text-xs font-bold px-3 py-1 rounded-md uppercase">Active Today</span>
                ) : (
                   <span className="bg-white/10 text-gray-400 text-xs font-bold px-3 py-1 rounded-md uppercase">Past Ticket</span>
                )}
                <span className="text-gray-500 text-sm">{new Date(hook.created_at).toLocaleDateString()}</span>
              </div>
              
              {hook.image_url && (
                <img src={hook.image_url} alt="Free Ticket" className="w-full h-auto object-cover rounded-xl border border-white/5 max-h-[500px]" />
              )}
              
              {hook.description && (
                <div className="w-full mt-4 text-white text-xl font-bold bg-black/30 p-6 rounded-xl border border-white/5">
                  {hook.description}
                </div>
              )}
            </div>
          ))}

          {hooks.length === 0 && (
            <div className="text-gray-400 font-bold text-center p-12 bg-black/30 rounded-xl border border-white/5">
              No free tickets have been posted yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
