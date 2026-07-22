import { checkAdminAuth } from '../actions';
import { getAllFreeHooks, getWonTickets, getUsers, getPremiumTickets, getAllTestimonials } from '../actions';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';

export default async function AdminPage() {
  const isAuthed = await checkAdminAuth();
  
  if (!isAuthed) {
    return <AdminLogin />;
  }

  const freeHooks = await getAllFreeHooks();
  const wonTickets = await getWonTickets();
  const users = await getUsers();
  const premiumTickets = await getPremiumTickets();
  const testimonials = await getAllTestimonials();

  return <AdminDashboard freeHooks={freeHooks} wonTickets={wonTickets} users={users} premiumTickets={premiumTickets} testimonials={testimonials} />;
}
