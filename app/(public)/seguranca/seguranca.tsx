"use client";

import MenuPublic from '../../components/PublicMenu/DesktopMenu';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import Link from 'next/link';
import styles from './seguranca.module.css';
import { useState } from 'react';
import { FaShieldAlt, FaLock, FaDatabase, FaEye, FaServer, FaTools } from 'react-icons/fa';

const Seguranca = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const securityFeatures = [
    {
      icon: <FaLock size={40} />,
      title: CONSTANTES.SEGURANCA_01,
      description: CONSTANTES.SEGURANCA_01_DESCRICAO
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: CONSTANTES.SEGURANCA_02,
      description: CONSTANTES.SEGURANCA_02_DESCRICAO
    },
    {
      icon: <FaDatabase size={40} />,
      title: CONSTANTES.SEGURANCA_03,
      description: CONSTANTES.SEGURANCA_03_DESCRICAO
    },
    {
      icon: <FaEye size={40} />,
      title: CONSTANTES.SEGURANCA_04,
      description: CONSTANTES.SEGURANCA_04_DESCRICAO
    },
    {
      icon: <FaServer size={40} />,
      title: CONSTANTES.SEGURANCA_05,
      description: CONSTANTES.SEGURANCA_05_DESCRICAO
    },
    {
      icon: <FaTools size={40} />,
      title: CONSTANTES.SEGURANCA_06,
      description: CONSTANTES.SEGURANCA_06_DESCRICAO
    }
  ];

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
            <h1 className={styles.title}>{CONSTANTES.TITULO_SEGURANCA}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_SEGURANCA}</p>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.securityFeatures}>
          <div className={styles.featuresGrid}>
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Seguranca; 