"use client";

import { CONSTANTES } from '../../../../common/constantes';
import styles from './deskTopMenu.module.css';
import { AiOutlineClockCircle } from 'react-icons/ai';
import Link from 'next/link';

const DeskTopMenu = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.desktopMenuWrapper}>
        <Link className={styles.logo} href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.25rem' }}>
          <AiOutlineClockCircle size={24} />
          {CONSTANTES.TITULO_SITE}
        </Link>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} href="/recursos">{CONSTANTES.TITULO_MENU_RECURSOS}</Link>
          <Link className={styles.navLink} href="/precos">{CONSTANTES.TITULO_MENU_PRECOS}</Link>
          <Link className={styles.navLink} href="/como-funciona">{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</Link>
          <Link className={styles.primaryButton} href="/login">{CONSTANTES.TEXT_BOTAO_LOGIN}</Link>
        </div>
      </div>
    </nav>
  );
};

export default DeskTopMenu;

