import dynamic from 'next/dynamic';

const Perguntas = dynamic(() => import('./perguntas'), {
  ssr: false
});

export default function PerguntasPage() {
  return <Perguntas />;
} 