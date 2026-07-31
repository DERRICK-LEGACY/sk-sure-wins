import { redirect } from 'next/navigation';
import VipDashboardClient from '@/components/VipDashboardClient';
import { getVipSession, getEntitledTickets } from '@/app/actions';
import prisma from '@/lib/db';

export default async function VipDashboardPage() {
  const session = await getVipSession();

  if (!session) {
    redirect('/login');
  }

  // 1. Fetch full user details with active subscriptions
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
        include: { package: true }
      }
    }
  });

  if (!user || user.subscriptions.length === 0) {
    return <VipDashboardClient user={session} subscriptions={[]} tickets={[]} />;
  }

  // 2. Fetch fully verified tickets (Backend Entitlement Check via Server Action)
  const tickets = await getEntitledTickets();

  // 3. Map Prisma relations to expected format if needed by frontend
  const formattedSubs = user.subscriptions.map(sub => ({
    ...sub,
    packages: sub.package // map prisma 'package' to old 'packages' expected by frontend
  }));

  const formattedTickets = tickets.map(ticket => ({
    ...ticket,
    packages: ticket.audiences[0]?.package // simplistic mapping for the frontend to show package tier
  }));

  return <VipDashboardClient user={session} subscriptions={formattedSubs} tickets={formattedTickets} />;
}
