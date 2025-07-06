"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer/footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Lista de rotas privadas onde o footer não deve aparecer
  const privateRoutes = [
    '/dashboard',
    '/relatorios',
    '/configuracao',
    '/registrar-ponto',
    '/bemvindo'
  ];
  
  // Verifica se a rota atual é privada
  const isPrivateRoute = privateRoutes.some(route => pathname?.startsWith(route));
  
  // Se for rota privada, não renderiza o footer
  if (isPrivateRoute) {
    return null;
  }
  
  // Se for rota pública, renderiza o footer
  return <Footer />;
};

export default ConditionalFooter; 