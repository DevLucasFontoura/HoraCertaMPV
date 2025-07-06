import dynamic from 'next/dynamic';

const Suporte = dynamic(() => import('./suporte'), {
  ssr: false
});

export default function SuportePage() {
  return <Suporte />;
} 