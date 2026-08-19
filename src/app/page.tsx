import { Metadata } from 'next';
import { getAllFreeHooks, getWonTickets, getAllTestimonials } from './actions';
import HomePage from '@/components/HomePage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'SK Sure Wins - Premium Betting Tips',
  description: 'Welcome to SK Sure Wins - Premium Betting Tips & Predictions',
};

export default async function Page() {
  const [freeHooks, wonTickets, testimonials] = await Promise.all([
    getAllFreeHooks(),
    getWonTickets(),
    getAllTestimonials()
  ]);

  return <HomePage freeHooks={freeHooks} wonTickets={wonTickets} testimonials={testimonials} />;
}
