import dynamic from 'next/dynamic';

const Feriados = dynamic(() => import('./feriados'), {
  ssr: false
});

export default function FeriadosPage() {
  return <Feriados />;
} 