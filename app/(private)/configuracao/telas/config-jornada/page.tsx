import dynamic from 'next/dynamic';

const Jornada = dynamic(() => import('./jornada'), {
  ssr: false
});

export default function JornadaPage() {
  return <Jornada />;
} 