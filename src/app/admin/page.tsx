import { Metadata } from 'next';
import { checkAdminAuth } from '../actions';
import { cookies } from 'next/headers';
import { getAllFreeHooks, getWonTickets, getClientsWithSubscriptions, getTickets, getAllTestimonials, getPackages } from '../actions';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SK Sure Wins',
  description: 'Admin dashboard for SK Sure Wins',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuthed = await checkAdminAuth();
  
  if (!isAuthed) {
    return <AdminLogin />;
  }

  const cookieStore = await cookies();
  const adminToken = cookieStore.get("sk_admin_session")?.value;

  const [freeHooks, wonTickets, clients, premiumTickets, testimonials, packages] = await Promise.all([
    getAllFreeHooks(),
    getWonTickets(),
    getClientsWithSubscriptions(),
    getTickets(),
    getAllTestimonials(),
    getPackages()
  ]);

  return <AdminDashboard 
    freeHooks={freeHooks} 
    wonTickets={wonTickets} 
    clients={clients} 
    premiumTickets={premiumTickets} 
    testimonials={testimonials} 
    packages={packages} 
  />;
}
