"use client";

import { AiOutlineHome, AiOutlineDashboard, AiOutlineSetting } from 'react-icons/ai';
import { IoStatsChartOutline } from 'react-icons/io5';
import { CONSTANTES } from '../../common/constantes';
import { FiPlusCircle } from 'react-icons/fi';
import styles from './menu.module.css';
import Link from 'next/link';

const BottomNav = () => {
  return (
    <>
      {/* Versão Mobile */}
      <nav className={styles.mobileNav}>
        <Link href="/" className={styles.active}> 
          <AiOutlineHome size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_HOME}</span>
        </Link>
        <Link href="/dashboard"> 
          <AiOutlineDashboard size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_DASHBOARD}</span>
        </Link>
        <button className={styles.addButton}> 
          <FiPlusCircle size={32} />
        </button>
        <Link href="/relatorios"> 
          <IoStatsChartOutline size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_RELATORIOS}</span>
        </Link>
        <Link href="/configuracao"> 
          <AiOutlineSetting size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_AJUSTES}</span>
        </Link>
      </nav>

      {/* Versão Desktop */}
      <nav className={styles.desktopNav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.active}> 
            <AiOutlineHome size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_HOME}</span>
          </Link>  
          <Link href="/dashboard"> 
            <AiOutlineDashboard size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_DASHBOARD}</span>
          </Link>
          <button className={styles.addButton}> 
            <FiPlusCircle size={32} /> 
          </button>
          <Link href="/relatorios"> 
            <IoStatsChartOutline size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_RELATORIOS}</span>
          </Link>
          <Link href="/configuracao"> 
            <AiOutlineSetting size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_AJUSTES}</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default BottomNav; 