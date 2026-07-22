export const dynamic = 'force-dynamic';

import { getAllFreeHooks, getWonTickets, getAllTestimonials } from './actions';
import HomePage from '@/components/HomePage';

export default async function Page() {
  const freeHooks = await getAllFreeHooks();
  const wonTickets = await getWonTickets();
  const testimonials = await getAllTestimonials();

  return <HomePage freeHooks={freeHooks} wonTickets={wonTickets} testimonials={testimonials} />;
}
