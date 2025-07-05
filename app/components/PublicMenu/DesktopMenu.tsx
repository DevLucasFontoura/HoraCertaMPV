"use client";

import { CONSTANTES } from '../../common/constantes';
import styles from './desktopMenu.module.css';
import { AiOutlineClockCircle } from 'react-icons/ai';

const DesktopMenu = () => {
  return (
    <div className={styles.desktopMenuWrapper}>
      <a className={styles.logo} href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.25rem' }}>
        <AiOutlineClockCircle size={24} />
        {CONSTANTES.TITULO_SITE}
      </a>
      <div className={styles.navLinks}>
        <a className={styles.navLink} href="/recursos">{CONSTANTES.TITULO_MENU_RECURSOS}</a>
        <a className={styles.navLink} href="/precos">{CONSTANTES.TITULO_MENU_PRECOS}</a>
        <a className={styles.navLink} href="/como-funciona">{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</a>
        <a className={styles.primaryButton} href="/registro">{CONSTANTES.BOTAO_COMECAR}</a>
      </div>
    </div>
  );
};

export default DesktopMenu; 