"use client";

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AiOutlineClockCircle } from 'react-icons/ai';

import { CONSTANTES } from '../../../../common/constantes';
import styles from './deskTopMenu.module.css';

const DeskTopMenu = () => {
  const pathname = usePathname();

  const navLinks = useMemo(
    () => [
      { href: '/recursos', label: CONSTANTES.TITULO_MENU_RECURSOS },
      { href: '/precos', label: CONSTANTES.TITULO_MENU_PRECOS },
      { href: '/como-funciona', label: CONSTANTES.TITULO_MENU_COMO_FUNCIONA }
    ],
    []
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.desktopMenuWrapper}>
        <Link className={styles.logo} href="/">
          <span className={styles.logoIcon}>
            <AiOutlineClockCircle size={18} />
          </span>
          <span>{CONSTANTES.TITULO_SITE}</span>
        </Link>

        <div className={styles.navLinks}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link className={styles.primaryButton} href="/login">
          {CONSTANTES.TEXT_BOTAO_LOGIN}
        </Link>
      </div>
    </nav>
  );
};

export default DeskTopMenu;

