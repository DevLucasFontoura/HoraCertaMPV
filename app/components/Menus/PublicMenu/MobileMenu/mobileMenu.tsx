"use client";

import { useState } from 'react';
import { AiOutlineClockCircle, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../../../common/constantes';
import styles from './mobileMenu.module.css';
import Link from 'next/link';

const MobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Menu Mobile Button */}
      <motion.button 
        className={styles.mobileMenuButton}
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AiOutlineClose size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AiOutlineMenu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu Mobile */}
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
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              exit={{ x: '100vw' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            >
              {/* Header do menu */}
              <div className={styles.mobileMenuHeader}>
                <div className={styles.mobileMenuLogo}>
                  <AiOutlineClockCircle size={24} />
                  <span>Versão Beta</span>
                </div>
                <button
                  className={styles.mobileMenuCloseButton}
                  onClick={toggleMenu}
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
              
              <motion.div
                className={styles.mobileMenuContent}
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.05 }
                  },
                  closed: {}
                }}
              >
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobileNavLink} href="/recursos" onClick={toggleMenu}>
                    {CONSTANTES.TITULO_MENU_RECURSOS}
                  </Link>
                </motion.div>
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobileNavLink} href="/precos" onClick={toggleMenu}>
                    {CONSTANTES.TITULO_MENU_PRECOS}
                  </Link>
                </motion.div>
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobileNavLink} href="/como-funciona" onClick={toggleMenu}>
                    {CONSTANTES.TITULO_MENU_COMO_FUNCIONA}
                  </Link>
                </motion.div>
                <motion.div variants={{
                  closed: { opacity: 0, y: 20 },
                  open: { opacity: 1, y: 0 }
                }}>
                  <Link className={styles.mobilePrimaryButton} href="/login" onClick={toggleMenu}>
                    {CONSTANTES.TEXT_BOTAO_LOGIN}
                  </Link>
                </motion.div>
              </motion.div>
                
              {/* Footer do menu */}
              <div className={styles.mobileMenuFooter}>
                <div className={styles.mobileMenuFooterText}>
                  <p>
                    <AiOutlineClockCircle size={16} />
                    Hora Certa
                  </p>
                  <span>Controle de ponto simplificado</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;

