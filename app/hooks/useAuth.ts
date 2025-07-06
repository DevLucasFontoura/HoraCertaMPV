import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthService, UserData } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Buscar dados do usuário no Firestore
          const data = await AuthService.getUserData(user.uid);
          setUserData(data);
          
          // Atualizar localStorage
          if (data) {
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
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userData');
        localStorage.removeItem('userUid');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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