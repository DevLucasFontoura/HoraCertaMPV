"use client";

import { AiOutlineClockCircle, AiOutlineEdit, AiOutlineFileText, AiOutlineMobile, AiOutlineSafety, AiOutlineTeam, AiOutlineBarChart, AiOutlineCloud, AiOutlineNotification, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import DesktopMenu from '../components/PublicMenu/DesktopMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../common/constantes';
import styles from './recursos.module.css';
import { useState } from 'react';
import Link from 'next/link';

const FeaturesPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {setIsMobileMenuOpen(!isMobileMenuOpen);};

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
                  <Link className={styles.mobileNavLink} href="/como-funciona" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</Link>
                  <Link className={styles.mobileNavLink} href="/precos" onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_PRECOS}</Link>
                  <Link className={styles.mobileNavLink} href="/" onClick={toggleMenu}>{CONSTANTES.HOME}</Link>
                  <Link className={styles.mobilePrimaryButton} href="/registro" onClick={toggleMenu}>{CONSTANTES.BOTAO_COMECAR}</Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{CONSTANTES.TITULO_RECURSOS_COMPLETOS}</h1>
        <p className={styles.headerSubtitle}>{CONSTANTES.SUBTITULO_RECURSOS_COMPLETOS}</p>
      </header>

      <section className={styles.featuresSection}>
        <div className={styles.featureCategory}>
          <h2 className={styles.categoryTitle}>{CONSTANTES.CARD_REGISTRO_DE_PONTO_TITULO}</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineClockCircle size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_REGISTRO_DE_PONTO_01_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_01_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_01_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_01_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineMobile size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_REGISTRO_DE_PONTO_02_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_02_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_02_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_02_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineNotification size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_REGISTRO_DE_PONTO_03_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_03_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_03_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_REGISTRO_DE_PONTO_03_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.featureCategory}>
          <h2 className={styles.categoryTitle}>{CONSTANTES.CARD_GESTAO_E_EDICAO_TITULO}</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineEdit size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_GESTAO_E_EDICAO_01_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_01_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_01_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_01_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineTeam size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_GESTAO_E_EDICAO_02_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_02_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_02_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_02_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineCloud size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_GESTAO_E_EDICAO_03_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_03_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_03_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_GESTAO_E_EDICAO_03_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.featureCategory}>
          <h2 className={styles.categoryTitle}>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_TITULO}</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineFileText size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_01_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_01_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_01_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_01_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineBarChart size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_02_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_02_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_02_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_02_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><AiOutlineSafety size={28} /></div>
              <div>
                <h3 className={styles.featureTitle}>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_03_TITULO}</h3>
                <div className={styles.featureDescription}>
                  <ul>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_03_ITEM_01}</li>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_03_ITEM_02}</li>
                    <li>{CONSTANTES.CARD_RELATORIOS_E_EXPORTACAO_03_ITEM_03}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{CONSTANTES.TITULO_PRONTO_PARA_COMECAR}</h2>
        <p className={styles.ctaDescription}>{CONSTANTES.SUBTITULO_PRONTO_PARA_COMECAR}</p>
        <div className={styles.ctaButtons}>
          <Link className={styles.primaryButton} href="/registro">{CONSTANTES.BOTAO_CADASTRAR_GRATUITAMENTE}</Link>
          <Link className={styles.secondaryButton} href="/precos">{CONSTANTES.BOTAO_VER_PLANOS}</Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;