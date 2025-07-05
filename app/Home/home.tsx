"use client";

import { useState } from 'react';
import { AiOutlineClockCircle, AiOutlineEdit, AiOutlineFileText, AiOutlineMobile, AiOutlineSafety, AiOutlineTeam, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import AnimatedClock from '../components/AnimatedClock/AnimatedClock';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../common/constantes';
import DesktopMenu from '../components/PublicMenu/DesktopMenu';
import styles from './home.module.css';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Menu clicked, current state:', isMobileMenuOpen);
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
                  <a className={styles.mobileNavLink} href="/Recursos" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_RECURSOS}</a>
                  <a className={styles.mobileNavLink} href="/precos" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_PRECOS}</a>
                  <a className={styles.mobileNavLink} href="/como-funciona" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</a>
                  <a className={styles.mobilePrimaryButton} href="/registro" onClick={toggleMenu}>{CONSTANTES.BOTAO_COMECAR}</a>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <div className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedClock />
          <div className={styles.gradient} />
          <h1 className={styles.heroTitle}>{CONSTANTES.TITULO_PRINCIPAL}</h1>
          <p className={styles.heroSubtitle}>{CONSTANTES.SUBTITULO_PRINCIPAL}</p>
          <div className={styles.buttonGroup}>
            <a className={styles.primaryButton} href="/registro">{CONSTANTES.BOTAO_COMECAR}</a>
            <a className={styles.secondaryButton} href="/login">{CONSTANTES.BOTAO_LOGIN}</a>
          </div>
        </motion.div>
      </div>

      <section className={styles.features} id="recursos">
        <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_RECURSOS}</h2>
        <p className={styles.sectionSubtitle}>{CONSTANTES.SUBTITULO_RECURSOS}</p>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineClockCircle size={28} /></div>
            <div>
              <h3>{CONSTANTES.CARD_RECURSOS_01_TITULO}</h3>
              <p>{CONSTANTES.CARD_RECURSOS_01_SUBTITULO}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineEdit size={28} /></div>
            <div>
              <h3>{CONSTANTES.CARD_RECURSOS_02_TITULO}</h3>
              <p>{CONSTANTES.CARD_RECURSOS_02_SUBTITULO}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineFileText size={28} /></div>
            <div>
              <h3>{CONSTANTES.CARD_RECURSOS_03_TITULO}</h3>
              <p>{CONSTANTES.CARD_RECURSOS_03_SUBTITULO}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineMobile size={28} /></div>
            <div>
              <h3>{CONSTANTES.CARD_RECURSOS_04_TITULO}</h3>
              <p>{CONSTANTES.CARD_RECURSOS_04_SUBTITULO}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineSafety size={28} /></div>
            <div>
              <h3>{CONSTANTES.CARD_RECURSOS_05_TITULO}</h3>
              <p>{CONSTANTES.CARD_RECURSOS_05_SUBTITULO}</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><AiOutlineTeam size={28} /></div>
            <div>
              <h3>{CONSTANTES.CARD_RECURSOS_06_TITULO}</h3>
              <p>{CONSTANTES.CARD_RECURSOS_06_SUBTITULO}</p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className={styles.enterpriseSection}>
        <div className={styles.enterpriseContent}>
          <div>
            <h2 className={styles.sectionTitle}>{CONSTANTES.TITULO_EMPRESA}</h2>
            <p className={styles.sectionSubtitle}>{CONSTANTES.SUBTITULO_EMPRESA}</p>
            <span className={styles.comingSoonBadge}>{CONSTANTES.COMING_SOON}</span>
          </div>
          <div className={styles.enterpriseImage}>{CONSTANTES.ICONE_EMPRESA}</div>
        </div>
      </section> */}
    </div>
  );
};

export default LandingPage;