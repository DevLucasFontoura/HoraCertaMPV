"use client";

import { FaArrowLeft, FaClock, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import { CONSTANTES } from '../../../../common/constantes';
import BottomNav from '../../../../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './suporte.module.css';
import { motion } from 'framer-motion';
import React from 'react';

interface SupportItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
}

const supportItems: SupportItem[] = [
  {title: CONSTANTES.SUPORTE_01, description: CONSTANTES.SUPORTE_01_DESCRICAO, icon: <FaClock size={24} />},
  {title: CONSTANTES.SUPORTE_02, description: CONSTANTES.EMAIL_SUPORTE, icon: <FaEnvelope size={24} />},
  {title: CONSTANTES.SUPORTE_03, description: CONSTANTES.SUPORTE_03_DESCRICAO, icon: <FaClock size={24} />},
  {title: CONSTANTES.SUPORTE_04, description: CONSTANTES.SUPORTE_04_DESCRICAO, icon: <FaQuestionCircle size={24} />, path: CONSTANTES.ROUTE_CONFIGURACAO_PERGUNTAS},
];

export default function SupportScreen() {
  const router = useRouter();

  const handleItemClick = (item: SupportItem) => {
    if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaQuestionCircle size={200} color="rgba(0,0,0,0.03)" />
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
            <h1 className={styles.title}>{CONSTANTES.TITULO_SUPORTE}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_SUPORTE}</p>
          </div>
        </div>

        <div className={styles.supportContainer}>
          {supportItems.map((item, index) => (
            <motion.div 
              key={index}
              className={styles.supportItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleItemClick(item)}
              style={{ cursor: item.path ? 'pointer' : 'default' }}
            >
              <div className={styles.iconContainer}>
                {item.icon}
              </div>
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                {item.title === CONSTANTES.SUPORTE_02 && (
                  <button 
                    className={styles.contactLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(CONSTANTES.ROUTE_CENTRAL_DE_AJUDA, '_blank');
                    }}
                  >
                    Acessar formulário de contato
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <p className={styles.footerText}>{CONSTANTES.TEXTO_SUPORTE_01}</p>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}