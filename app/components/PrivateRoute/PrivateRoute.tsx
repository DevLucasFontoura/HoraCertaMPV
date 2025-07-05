import { Navigate } from 'react-router-dom';
import { CONSTANTES } from '../../common/constantes';
import { auth } from '../../services/firebaseConfig';
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica o estado inicial
    const checkAuth = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Verifica se o token ainda é válido
          await currentUser.getIdToken(true);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Limpa o localStorage se não houver usuário
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
      } finally {
        setLoading(false);
      }
    };

    // Observa mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      if (!user) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
      }
    });

    checkAuth();
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={CONSTANTES.ROUTE_LOGIN} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 