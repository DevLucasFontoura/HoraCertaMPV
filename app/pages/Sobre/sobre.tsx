import MenuPublic from '../../components/PublicMenu/DesktopMenu';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import { Link } from 'react-router-dom';
import styles from './sobre.module.css';
import { useState } from 'react';

const Sobre = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* Logo removido, agora está no DesktopMenu */}
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
                  <Link className={styles.mobileNavLink} to={CONSTANTES.RECURSOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_RECURSOS}</Link>
                  <Link className={styles.mobileNavLink} to={CONSTANTES.PRECOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_PRECOS}</Link>
                  <Link className={styles.mobileNavLink} to={CONSTANTES.COMO_FUNCIONA} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</Link>
                  <Link className={styles.mobilePrimaryButton} to={CONSTANTES.REGISTRO} onClick={toggleMenu}>{CONSTANTES.BOTAO_COMECAR}</Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}><h1 className={styles.subtitle}>{CONSTANTES.TITULO_SOBRE_PUBLIC}</h1></div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.sectionRow}>
          <img src={CONSTANTES.IMAGE_SOBRE_01}className={styles.sectionImage}/>
          <div className={styles.sectionText}><h2 className={styles.equipeTitulo}>{CONSTANTES.TITULO_MISSAO}</h2><p>{CONSTANTES.DESCRICAO_MISSAO}</p></div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.values}>
          <h2 className={styles.equipeTitulo}>{CONSTANTES.TITULO_NOSSOS_VALORES}</h2>
          <div className={styles.differenceGridTextOnly}>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_01_NOSSOS_VALORES}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_01_NOSSOS_VALORES}</p></div>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_02_NOSSOS_VALORES}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_02_NOSSOS_VALORES}</p></div>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_03_NOSSOS_VALORES}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_03_NOSSOS_VALORES}</p></div>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_04_NOSSOS_VALORES}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_04_NOSSOS_VALORES}</p></div>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.sectionRowReverse}>
          <div className={styles.sectionText}> <h2 className={styles.equipeTitulo}>{CONSTANTES.TITULO_NOSSA_HISTORIA}</h2> <p>{CONSTANTES.DESCRICAO_NOSSA_HISTORIA_01}</p> <p>{CONSTANTES.DESCRICAO_NOSSA_HISTORIA_02}</p> </div>
          <img src={CONSTANTES.IMAGE_SOBRE_02} className={styles.sectionImage}/>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.difference}>
          <h2 className={styles.equipeTitulo}>{CONSTANTES.TITULO_O_QUE_NOS_DIFERENCIA}</h2>
          <div className={styles.differenceGridTextOnly}>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_01_O_QUE_NOS_DIFERENCIA}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_01_O_QUE_NOS_DIFERENCIA}</p></div>  
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_02_O_QUE_NOS_DIFERENCIA}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_02_O_QUE_NOS_DIFERENCIA}</p></div>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_03_O_QUE_NOS_DIFERENCIA}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_03_O_QUE_NOS_DIFERENCIA}</p></div>
            <div className={styles.differenceTextCard}> <strong>{CONSTANTES.TITULO_ITEM_04_O_QUE_NOS_DIFERENCIA}</strong> <p>{CONSTANTES.DESCRICAO_ITEM_04_O_QUE_NOS_DIFERENCIA}</p></div>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        <section className={styles.sectionRow}>
          <img src={CONSTANTES.IMAGE_SOBRE_03} className={styles.sectionImage}/>
          <div className={styles.sectionText}> <h2 className={styles.equipeTitulo}>{CONSTANTES.TITULO_EQUIPE}</h2> <p>{CONSTANTES.DESCRICAO_EQUIPE}</p></div>
        </section>
      </div>
    </>
  );
};

export default Sobre; 