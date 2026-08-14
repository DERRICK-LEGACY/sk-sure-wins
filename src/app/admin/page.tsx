import { Metadata } from 'next';
import { checkAdminAuth } from '../actions';
import { getAllFreeHooks, getWonTickets, getClientsWithSubscriptions, getTickets, getAllTestimonials, getPackages } from '../actions';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SK Sure Wins',
  description: 'Admin dashboard for SK Sure Wins',
};

export default async function AdminPage() {
  const isAuthed = await checkAdminAuth();
  
  if (!isAuthed) {
    return <AdminLogin />;
  }

  const freeHooks = await getAllFreeHooks();
  const wonTickets = await getWonTickets();
  const clients = await getClientsWithSubscriptions();
  const premiumTickets = await getTickets();
  const testimonials = await getAllTestimonials();
  const packages = await getPackages();

  return <AdminDashboard 
    freeHooks={freeHooks} 
    wonTickets={wonTickets} 
    clients={clients} 
    premiumTickets={premiumTickets} 
    testimonials={testimonials} 
    packages={packages} 
  />;
}
