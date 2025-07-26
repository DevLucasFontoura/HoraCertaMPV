import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthService, UserData } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Buscar dados do usuário no Firestore
          const data = await AuthService.getUserData(user.uid);
          setUserData(data);
          
          // Atualizar localStorage apenas no cliente
          if (typeof window !== 'undefined' && data) {
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userData', JSON.stringify(data));
            localStorage.setItem('userUid', user.uid);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        // Limpar dados quando usuário faz logout
        setUserData(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userData');
          localStorage.removeItem('userUid');
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  const logout = async () => {
    try {
      await AuthService.logoutUser();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user,
    userData,
    loading,
    logout,
    isAuthenticated: !!user
  };
}; 