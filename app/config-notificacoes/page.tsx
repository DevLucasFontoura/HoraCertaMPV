import dynamic from 'next/dynamic';

const Notificacoes = dynamic(() => import('./notificacoes'), {
  ssr: false
});

export default function NotificacoesPage() {
  return <Notificacoes />;
} 