import { getVipSession, getPremiumTicketsByTier } from '../actions';
import { redirect } from 'next/navigation';
import VipDashboardClient from '@/components/VipDashboardClient';

export default async function VipDashboardPage() {
  const user = await getVipSession();
  
  if (!user) {
    redirect('/login');
  }

  // Determine which tier the user's package maps to
  const pkg = user.package || "";
  let tier = "Bronze";
  if (pkg.startsWith("Silver")) tier = "Silver";
  else if (pkg.startsWith("Gold")) tier = "Gold";
  else if (pkg.startsWith("Premium")) tier = "Premium";
  else if (pkg.startsWith("Life Changer")) tier = "Life Changer";

  const tickets = await getPremiumTicketsByTier(tier);

  return <VipDashboardClient user={user} tickets={tickets} tier={tier} />;
}
