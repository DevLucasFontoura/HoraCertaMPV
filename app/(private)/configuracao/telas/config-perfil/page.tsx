import dynamic from 'next/dynamic';

const Perfil = dynamic(() => import('./perfil'), {
  ssr: false
});

export default function PerfilPage() {
  return <Perfil />;
} 