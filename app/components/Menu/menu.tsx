"use client";

import { AiOutlineHome, AiOutlineDashboard, AiOutlineSetting } from 'react-icons/ai';
import { IoStatsChartOutline } from 'react-icons/io5';
import { CONSTANTES } from '../../common/constantes';
import { FiPlusCircle } from 'react-icons/fi';
import styles from './menu.module.css';

const BottomNav = () => {
  return (
    <>
      {/* Versão Mobile */}
      <nav className={styles.mobileNav}>
        <a href="/" className={styles.active}> 
          <AiOutlineHome size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_HOME}</span>
        </a>
        <a href="/dashboard"> 
          <AiOutlineDashboard size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_DASHBOARD}</span>
        </a>
        <button className={styles.addButton}> 
          <FiPlusCircle size={32} />
        </button>
        <a href="/relatorios"> 
          <IoStatsChartOutline size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_RELATORIOS}</span>
        </a>
        <a href="/configuracao"> 
          <AiOutlineSetting size={24} /> 
          <span>{CONSTANTES.TITULO_MENU_AJUSTES}</span>
        </a>
      </nav>

      {/* Versão Desktop */}
      <nav className={styles.desktopNav}>
        <div className={styles.navContent}>
          <a href="/" className={styles.active}> 
            <AiOutlineHome size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_HOME}</span>
          </a>  
          <a href="/dashboard"> 
            <AiOutlineDashboard size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_DASHBOARD}</span>
          </a>
          <button className={styles.addButton}> 
            <FiPlusCircle size={32} /> 
          </button>
          <a href="/relatorios"> 
            <IoStatsChartOutline size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_RELATORIOS}</span>
          </a>
          <a href="/configuracao"> 
            <AiOutlineSetting size={24} /> 
            <span>{CONSTANTES.TITULO_MENU_AJUSTES}</span>
          </a>
        </div>
      </nav>
    </>
  );
};

export default BottomNav; 