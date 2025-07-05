import { AiOutlineCheckCircle, AiOutlineInfoCircle, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import DesktopMenu from '../../components/PublicMenu/DesktopMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import styles from './precos.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Precos = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        {/* Menu Desktop */}
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
                  <Link className={styles.mobileNavLink} to={CONSTANTES.COMO_FUNCIONA} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_COMO_FUNCIONA}</Link>
                  <Link className={styles.mobileNavLink} to={CONSTANTES.RECURSOS} onClick={toggleMenu}>{CONSTANTES.TITULO_MENU_RECURSOS}</Link>
                  <Link className={styles.mobileNavLink} to={CONSTANTES.HOME} onClick={toggleMenu}>{CONSTANTES.TITULO_HOME}</Link>
                  <Link className={styles.mobilePrimaryButton} to={CONSTANTES.REGISTRO} onClick={toggleMenu}>{CONSTANTES.BOTAO_CADASTRAR_GRATUITAMENTE}</Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{CONSTANTES.TITULO_PRECOS}</h1>
        <p className={styles.headerSubtitle}>{CONSTANTES.SUBTITULO_PRECOS}</p>
      </header>

      <div className={styles.pricingGrid}>
        <div className={styles.pricingCard}>
          <h3 className={styles.planName}>{CONSTANTES.CARD_PRECOS_01_TITULO}</h3>
          <div className={styles.planPrice}>{CONSTANTES.CARD_PRECOS_01_VALOR}<span>{CONSTANTES.CARD_PRECOS_01_VALOR_MES}</span></div>
          <ul className={styles.planFeatures}>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_01_ITEM_01}</li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_01_ITEM_02}
              <span className={styles.infoIcon}><AiOutlineInfoCircle />
                <div className={styles.tooltip}>
                  {CONSTANTES.CARD_PRECOS_ITEM_01_INFO}<br/>
                  {CONSTANTES.CARD_PRECOS_ITEM_02_INFO}<br/>
                </div>
              </span>
            </li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_01_ITEM_03}</li>
          </ul>
          <Link className={styles.primaryButton} to={CONSTANTES.REGISTRO}>{CONSTANTES.TITULO_BOTAO_COMECAR}</Link>
        </div>

        <div className={styles.pricingCard}>
          <h3 className={styles.planName}>{CONSTANTES.CARD_PRECOS_02_TITULO}</h3>
          <div className={styles.planPrice}>{CONSTANTES.CARD_PRECOS_02_VALOR}<span>{CONSTANTES.CARD_PRECOS_02_VALOR_MES}</span></div>
          <ul className={styles.planFeatures}>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_02_ITEM_01}
              <span className={styles.infoIcon}><AiOutlineInfoCircle />
                <div className={styles.tooltip}>
                  {CONSTANTES.CARD_PRECOS_02_ITEM_01_INFO}<br/>
                  {CONSTANTES.CARD_PRECOS_02_ITEM_02_INFO}<br/>
                  {CONSTANTES.CARD_PRECOS_02_ITEM_03_INFO}<br/>
                  {CONSTANTES.CARD_PRECOS_02_ITEM_04_INFO}
                </div>
              </span>
            </li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_02_ITEM_02}</li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_02_ITEM_03}</li>
          </ul>
          <Link className={styles.primaryButton} to={CONSTANTES.REGISTRO}>{CONSTANTES.TITULO_BOTAO_COMECAR}</Link>
        </div>

        <div className={styles.pricingCard}>
          <h3 className={styles.planName}>{CONSTANTES.CARD_PRECOS_03_TITULO}</h3>
          <div className={styles.planPrice}>{CONSTANTES.CARD_PRECOS_03_VALOR}</div>
          <ul className={styles.planFeatures}>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_03_ITEM_01}</li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_03_ITEM_02}</li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_03_ITEM_03}</li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_03_ITEM_04}</li>
            <li className={styles.planFeature}><AiOutlineCheckCircle /> {CONSTANTES.CARD_PRECOS_03_ITEM_05}</li>
          </ul>
          <a className={styles.secondaryButton} href={`mailto:${CONSTANTES.EMAIL_FALE_CONOSCO}`}>{CONSTANTES.BOTAO_EM_BREVE}</a>
        </div>
      </div>
    </div>
  );
};

export default Precos;