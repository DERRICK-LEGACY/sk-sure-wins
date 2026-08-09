import { redirect } from 'next/navigation';
import VipDashboardClient from '@/components/VipDashboardClient';
import { getVipSession, getEntitledTickets } from '@/app/actions';
import prisma from '@/lib/db';

export default async function VipDashboardPage() {
  const session = await getVipSession();

  if (!session) {
    redirect('/login');
  }

  // 1. Fetch full user details with all subscriptions (to check expiration)
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      subscriptions: {
        include: { package: true },
        orderBy: { expiresAt: 'desc' }
      }
    }
  });

  const allSubscriptions = user?.subscriptions || [];
  
  // Filter truly active ones
  const activeSubscriptions = allSubscriptions.filter(
    (sub) => sub.status === 'ACTIVE' && new Date(sub.expiresAt) > new Date()
  );

  const isExpired = activeSubscriptions.length === 0 && allSubscriptions.length > 0;
  
  let daysRemaining: number | null = null;
  if (activeSubscriptions.length > 0) {
    // get the max expiresAt among active
    const maxExpiry = Math.max(...activeSubscriptions.map(s => new Date(s.expiresAt).getTime()));
    const diffTime = maxExpiry - new Date().getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 2. Fetch fully verified tickets
  let tickets: any[] = [];
  if (activeSubscriptions.length > 0) {
    tickets = await getEntitledTickets();
  }

  // 3. Map Prisma relations to expected format if needed by frontend
  const formattedSubs = activeSubscriptions.map(sub => ({
    ...sub,
    packages: sub.package // map prisma 'package' to old 'packages' expected by frontend
  }));

  const formattedTickets = tickets.map(ticket => ({
    ...ticket,
    packages: ticket.audiences[0]?.package // simplistic mapping for the frontend to show package tier
  }));

  return (
    <VipDashboardClient 
      user={session} 
      subscriptions={formattedSubs} 
      tickets={formattedTickets} 
      isExpired={isExpired}
      daysRemaining={daysRemaining}
    />
  );
}
