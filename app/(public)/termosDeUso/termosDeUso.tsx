"use client";

import MenuPublic from '../../components/PublicMenu/DesktopMenu';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import Link from 'next/link';
import styles from './termosDeUso.module.css';
import { useState } from 'react';

const TermosDeUso = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <MenuPublic />
        <motion.button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </motion.button>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className={styles.mobileMenuOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
              />
              <motion.div
                className={styles.mobileMenu}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.05 }
                    },
                    closed: {}
                  }}
                >
                  <Link className={styles.mobileNavLink} href={CONSTANTES.RECURSOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_RECURSOS}</Link>
                  <Link className={styles.mobileNavLink} href={CONSTANTES.PRECOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_PRECOS}</Link>
                  <Link className={styles.mobileNavLink} href={CONSTANTES.COMO_FUNCIONA} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</Link>
                  <Link className={styles.mobilePrimaryButton} href={CONSTANTES.REGISTRO} onClick={toggleMenu}>{CONSTANTES.BOTAO_COMECAR}</Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{CONSTANTES.TITULO_TERMOS_DE_USO}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_TERMOS_DE_USO}</p>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.content}>
          <div className={styles.termsSection}>
            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_01}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_01_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_02}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_02_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_03}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_03_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_04}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_04_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_05}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_05_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_06}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_06_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_07}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_07_DESCRICAO}</p>
            </div>

            <div className={styles.termItem}>
              <h2 className={styles.termTitle}>{CONSTANTES.TERMOS_08}</h2>
              <p className={styles.termDescription}>{CONSTANTES.TERMOS_08_DESCRICAO}</p>
            </div>
          </div>

          <div className={styles.footer}>
            <p className={styles.lastUpdate}>{CONSTANTES.TERMOS_ULTIMA_ATUALIZACAO}</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default TermosDeUso; 