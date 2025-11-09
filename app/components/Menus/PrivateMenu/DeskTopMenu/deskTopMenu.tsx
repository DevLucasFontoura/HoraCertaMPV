"use client";

import { CONSTANTES } from '../../../../common/constantes';
import styles from './deskTopMenu.module.css';
import { AiOutlineClockCircle, AiOutlineLogout } from 'react-icons/ai';
import { useAuth } from '../../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const DeskTopMenu = () => {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName') || userData?.name || '';
      setUserName(name);
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.desktopMenuWrapper}>
        <Link className={styles.logo} href="/bemvindo" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.25rem' }}>
          <AiOutlineClockCircle size={24} />
          {CONSTANTES.TITULO_SITE}
        </Link>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} href="/bemvindo">{CONSTANTES.TITULO_MENU_HOME}</Link>
          <Link className={styles.navLink} href="/dashboard">{CONSTANTES.TITULO_MENU_DASHBOARD}</Link>
          <Link className={styles.navLink} href="/historico">{CONSTANTES.TITULO_MENU_HISTORICO}</Link>
          {userName && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
            </div>
          )}
          <button className={styles.logoutButton} onClick={handleLogout}>
            <AiOutlineLogout size={18} />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DeskTopMenu;

