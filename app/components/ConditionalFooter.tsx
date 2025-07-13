"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from './Footer/footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  
  // Se não estiver montado ainda, renderiza o footer (evita hidratação)
  if (!mounted) {
    return <Footer />;
  }
  
  // Se for rota privada, não renderiza o footer
  if (isPrivateRoute) {
    return null;
  }
  
  // Se for rota pública, renderiza o footer
  return <Footer />;
};

export default ConditionalFooter; 