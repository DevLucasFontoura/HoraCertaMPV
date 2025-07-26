"use client";

import { motion } from 'framer-motion';
import { CONSTANTES } from '../../common/constantes';
import styles from './BetaBadge.module.css';

interface BetaBadgeProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showFeedbackText?: boolean;
}

const BetaBadge = ({ 
  className = '', 
  position = 'bottom-right',
  showFeedbackText = true 
}: BetaBadgeProps) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return styles.topRight;
      case 'top-left':
        return styles.topLeft;
      case 'bottom-left':
        return styles.bottomLeft;
      default:
        return styles.bottomRight;
    }
  };

  return (
    <motion.div 
      className={`${styles.betaBadgeContainer} ${getPositionClass()} ${className}`}
      initial={{ opacity: 0, x: position.includes('right') ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.a 
        href="https://forms.gle/d677i9Psr5KF3Er16"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.betaBadgeLink}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={styles.betaBadgeText}>
          {CONSTANTES.VERSAO_BETA} {CONSTANTES.VERSAO}
        </span>
        {showFeedbackText && (
          <span className={styles.betaBadgeSubtext}>De a sua opinião</span>
        )}
      </motion.a>
    </motion.div>
  );
};

export default BetaBadge; 