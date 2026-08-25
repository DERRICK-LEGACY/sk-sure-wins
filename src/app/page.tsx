import { Metadata } from 'next';
import { getAllFreeHooks, getWonTickets, getAllTestimonials, getSpecialOffer } from './actions';
import HomePage from '@/components/HomePage';
import type { FreeHook, Ticket, Testimonial, Package } from '@prisma/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'SK Sure Wins - Premium Betting Tips',
  description: 'Welcome to SK Sure Wins - Premium Betting Tips & Predictions',
};

export default async function Page() {
  let freeHooks: FreeHook[] = [];
  let wonTickets: Ticket[] = [];
  let testimonials: Testimonial[] = [];
  let specialOffer: Package | null = null;

  try {
    const results = await Promise.all([
      getAllFreeHooks(),
      getWonTickets(),
      getAllTestimonials(),
      getSpecialOffer()
    ]);
    freeHooks = results[0] || [];
    wonTickets = results[1] || [];
    testimonials = results[2] || [];
    specialOffer = results[3] || null;
  } catch (error) {
    console.warn("Database connection failed during pre-render:", error);
  }

  return <HomePage freeHooks={freeHooks} wonTickets={wonTickets} testimonials={testimonials} specialOffer={specialOffer} />;
}
