import { FaArrowLeft, FaDatabase, FaChartArea, FaShieldAlt, FaUsers, FaCloud, FaUser } from 'react-icons/fa';
import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './politica.module.css';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PolicySection {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const policySections: PolicySection[] = [
  {title: CONSTANTES.POLITICA_DE_PRIVACIDADE_01, content: CONSTANTES.POLITICA_DE_PRIVACIDADE_01_RESPOSTA, icon: <FaDatabase size={24} />},
  {title: CONSTANTES.POLITICA_DE_PRIVACIDADE_02, content: CONSTANTES.POLITICA_DE_PRIVACIDADE_02_RESPOSTA, icon: <FaChartArea size={24} />},
  {title: CONSTANTES.POLITICA_DE_PRIVACIDADE_03, content: CONSTANTES.POLITICA_DE_PRIVACIDADE_03_RESPOSTA, icon: <FaShieldAlt size={24} />},
  {title: CONSTANTES.POLITICA_DE_PRIVACIDADE_04, content: CONSTANTES.POLITICA_DE_PRIVACIDADE_04_RESPOSTA, icon: <FaUsers size={24} />},
  {title: CONSTANTES.POLITICA_DE_PRIVACIDADE_05, content: CONSTANTES.POLITICA_DE_PRIVACIDADE_05_RESPOSTA, icon: <FaCloud size={24} />},
  {title: CONSTANTES.POLITICA_DE_PRIVACIDADE_06, content: CONSTANTES.POLITICA_DE_PRIVACIDADE_06_RESPOSTA, icon: <FaUser size={24} />},
];

export default function PrivacyPolicyScreen() {
  const navigate = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaShieldAlt size={200} color="rgba(0,0,0,0.03)" />
      </div>
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => router.push(CONSTANTES.ROUTE_CONFIGURACAO)}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{CONSTANTES.TITULO_POLITICA_DE_PRIVACIDADE}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_POLITICA_DE_PRIVACIDADE}</p>
          </div>
        </div>

        <div className={styles.policyContainer}>
          {policySections.map((section, index) => (
            <motion.div 
              key={index}
              className={styles.policySection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.iconContainer}>
                {section.icon}
              </div>
              <div className={styles.sectionContent}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <p className={styles.sectionText}>{section.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className={styles.footerText}>
          {CONSTANTES.POLITICA_DE_PRIVACIDADE_ULTIMA_ATUALIZACAO}
        </p>
      </motion.div>
      <BottomNav />
    </div>
  );
}