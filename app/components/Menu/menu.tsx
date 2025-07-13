"use client";

import { AiOutlineHome, AiOutlineDashboard, AiOutlineSetting } from 'react-icons/ai';
import { IoStatsChartOutline } from 'react-icons/io5';
import { CONSTANTES } from '../../common/constantes';
import { FiPlusCircle } from 'react-icons/fi';
import styles from './menu.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const handleAddButtonClick = () => {
    router.push('/registrar-ponto');
  };

  return (
    <>
      {/* Versão Mobile */}
      <nav className={styles.mobileNav}>
        <Link href="/bemvindo" className={isActive('/bemvindo') ? styles.active : ''}> 
          <AiOutlineHome size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_HOME}</span>
        </Link>
        <Link href="/dashboard" className={isActive('/dashboard') ? styles.active : ''}> 
          <AiOutlineDashboard size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_DASHBOARD}</span>
        </Link>
        <button className={styles.addButton} onClick={handleAddButtonClick}> 
          <FiPlusCircle size={32} />
        </button>
        <Link href="/relatorios" className={isActive('/relatorios') ? styles.active : ''}> 
          <IoStatsChartOutline size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_RELATORIOS}</span>
        </Link>
        <Link href="/configuracao" className={isActive('/configuracao') ? styles.active : ''}> 
          <AiOutlineSetting size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_AJUSTES}</span>
        </Link>
      </nav>

      {/* Versão Desktop */}
      <nav className={styles.desktopNav}>
        <div className={styles.navContent}>
          <Link href="/bemvindo" className={isActive('/bemvindo') ? styles.active : ''}> 
            <AiOutlineHome size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_HOME}</span>
          </Link>  
          <Link href="/dashboard" className={isActive('/dashboard') ? styles.active : ''}> 
            <AiOutlineDashboard size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_DASHBOARD}</span>
          </Link>
          <button className={styles.addButton} onClick={handleAddButtonClick}> 
            <FiPlusCircle size={32} /> 
          </button>
          <Link href="/relatorios" className={isActive('/relatorios') ? styles.active : ''}> 
            <IoStatsChartOutline size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_RELATORIOS}</span>
          </Link>
          <Link href="/configuracao" className={isActive('/configuracao') ? styles.active : ''}> 
            <AiOutlineSetting size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_AJUSTES}</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default BottomNav; 