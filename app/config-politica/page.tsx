import dynamic from 'next/dynamic';

const Politica = dynamic(() => import('./politica'), {
  ssr: false
});

export default function PoliticaPage() {
  return <Politica />;
} 