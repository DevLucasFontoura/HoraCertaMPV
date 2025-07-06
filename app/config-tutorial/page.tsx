import dynamic from 'next/dynamic';

const Tutorial = dynamic(() => import('./tutorial'), {
  ssr: false
});

export default function TutorialPage() {
  return <Tutorial />;
} 