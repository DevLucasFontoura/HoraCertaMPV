import dynamic from 'next/dynamic';

const Sobre = dynamic(() => import('./sobre'), {
  ssr: false
});

export default function SobrePage() {
  return <Sobre />;
} 