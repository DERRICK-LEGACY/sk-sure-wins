import { Metadata } from 'next';
import { getAllFreeHooks, getWonTickets, getAllTestimonials } from './actions';
import HomePage from '@/components/HomePage';

export const metadata: Metadata = {
  title: 'SK Sure Wins - Premium Betting Tips',
  description: 'Welcome to SK Sure Wins - Premium Betting Tips & Predictions',
};

export default async function Page() {
  const freeHooks = await getAllFreeHooks();
  const wonTickets = await getWonTickets();
  const testimonials = await getAllTestimonials();

  return <HomePage freeHooks={freeHooks} wonTickets={wonTickets} testimonials={testimonials} />;
}
