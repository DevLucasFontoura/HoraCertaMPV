"use client";

import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineFileText, AiOutlineBarChart, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import DesktopMenu from '../../components/PublicMenu/DesktopMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import styles from './comoFunciona.module.css';
import { useState } from 'react';
import Link from 'next/link';

const ComoFunciona = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <DesktopMenu />

        {/* Menu Mobile */}
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
                  <Link className={styles.mobileNavLink} href="/recursos" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_RECURSOS}</Link>
                  <Link className={styles.mobileNavLink} href="/precos" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_PRECOS}</Link>
                  <Link className={styles.mobileNavLink} href="/" onClick={toggleMenu}>{CONSTANTES.TITULO_HOME}</Link>
                  <Link className={styles.mobilePrimaryButton} href="/registro" onClick={toggleMenu}>{CONSTANTES.BOTAO_COMECAR}</Link>  
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{CONSTANTES.TITULO_COMO_FUNCIONA}</h1>
        <p className={styles.headerSubtitle}>{CONSTANTES.SUBTITULO_COMO_FUNCIONA}</p>
      </header>

      <section className={styles.stepsSection}>
        <div className={styles.step}>
          <div className={styles.stepIcon}><AiOutlineClockCircle size={32} /></div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>{CONSTANTES.TITULO_ITEM_01}</h3>
            <p className={styles.stepDescription}>{CONSTANTES.DESCRICAO_ITEM_01}</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}><AiOutlineFileText size={32} /></div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>{CONSTANTES.TITULO_ITEM_02}</h3>
            <p className={styles.stepDescription}>{CONSTANTES.DESCRICAO_ITEM_02}</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}><AiOutlineBarChart size={32} /></div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>{CONSTANTES.TITULO_ITEM_03}</h3>
            <p className={styles.stepDescription}>{CONSTANTES.DESCRICAO_ITEM_03}</p>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_RECURSOS_PRINCIPAIS}</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineCheckCircle /></div>
            <h3 className={styles.featureTitle}>{CONSTANTES.TITULO_RECURSOS_CARD_01}</h3>
            <p className={styles.featureDescription}>{CONSTANTES.DESCRICAO_RECURSOS_CARD_01}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineCheckCircle /></div>
            <h3 className={styles.featureTitle}>{CONSTANTES.TITULO_RECURSOS_CARD_02}</h3>
            <p className={styles.featureDescription}>{CONSTANTES.DESCRICAO_RECURSOS_CARD_02}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineCheckCircle /></div>
            <h3 className={styles.featureTitle}>{CONSTANTES.TITULO_RECURSOS_CARD_03}</h3>
            <p className={styles.featureDescription}>{CONSTANTES.DESCRICAO_RECURSOS_CARD_03}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineCheckCircle /></div>
            <h3 className={styles.featureTitle}>{CONSTANTES.TITULO_RECURSOS_CARD_04}</h3>
            <p className={styles.featureDescription}>{CONSTANTES.DESCRICAO_RECURSOS_CARD_04}</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{CONSTANTES.TITULO_PRONTO_PARA_COMECAR}</h2>
        <p className={styles.ctaDescription}>
          {CONSTANTES.SUBTITULO_PRONTO_PARA_COMECAR}
        </p>
        <div className={styles.ctaButtons}>
          <Link className={styles.primaryButton} href="/registro">{CONSTANTES.BOTAO_CADASTRAR_GRATUITAMENTE}</Link>
          <Link className={styles.secondaryButton} href="/precos">{CONSTANTES.BOTAO_VER_PLANOS}</Link>
        </div>
      </section>
    </div>
  );
};

export default ComoFunciona;