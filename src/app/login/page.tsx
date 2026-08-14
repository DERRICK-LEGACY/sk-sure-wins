import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'VIP Login - SK Sure Wins',
  description: 'Login to access your VIP premium tickets.',
};

export default function LoginPage() {
  return <LoginForm />;
}
