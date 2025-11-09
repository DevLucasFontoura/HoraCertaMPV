"use client";

import { AiOutlineArrowRight } from 'react-icons/ai';
import { CONSTANTES } from '../../common/constantes';
import styles from './hero.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className={styles.hero}>
      {/* Background subtle pattern */}
      <div className={styles.backgroundPattern} />
      
      {/* Main content wrapper */}
      <motion.div 
        className={styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Title */}
        <motion.h1 
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {CONSTANTES.TITULO_PRINCIPAL}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {CONSTANTES.SUBTITULO_PRINCIPAL}
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          className={styles.buttonGroup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link 
            className={styles.primaryButton} 
            href="/registro"
          >
            <span>{CONSTANTES.BOTAO_COMECAR}</span>
            <AiOutlineArrowRight className={styles.arrowIcon} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
