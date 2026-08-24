/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
export const revalidate = 3600;

import { getAllFreeHooks } from '@/app/actions';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Free Tickets - SK Sure Wins',
  description: 'View our recent free betting tickets.',
};
export default async function FreeTicketsPage() {
  let hooks: any[] = [];
  try {
    hooks = await getAllFreeHooks();
  } catch (e) {
    console.warn("Database connection failed during pre-render:", e);
  }

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
                {hook.isActive ? (
                   <span className="bg-[#25D366] text-black text-xs font-bold px-3 py-1 rounded-md uppercase">Active Today</span>
                ) : (
                   <span className="bg-[#25D366] text-black text-xs font-bold px-3 py-1 rounded-md uppercase">Active Today</span>
                )}
                <span className="text-gray-500 text-sm">{new Date(hook.createdAt).toLocaleDateString()}</span>
              </div>
              
              {hook.imageUrl && !hook.imageUrl.includes('Upload+Failed') && !hook.imageUrl.includes('placehold.co') && (
                <Image src={hook.imageUrl} alt="Free Ticket" width={800} height={500} className="w-full h-auto object-cover rounded-xl border border-white/5 max-h-[500px]" />
              )}
              
              {hook.description && (
                <div className="w-full mt-4 text-white text-xl font-bold bg-black/30 p-6 rounded-xl border border-white/5 text-center">
                  {(hook.description.startsWith('http://') || hook.description.startsWith('https://')) ? (
                    <a href={hook.description} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#25D366] text-black text-center rounded-xl font-black hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(37,211,102,0.4)]">
                      Click to access matches
                    </a>
                  ) : (
                    hook.description
                  )}
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
