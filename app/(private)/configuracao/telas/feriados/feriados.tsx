'use client';

import { FaCalendar, FaArrowLeft, FaPlus, FaTrash, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { CONSTANTES } from '../../../../common/constantes';
import BottomNav from '../../../../components/Menu/menu';
import { useRouter } from 'next/navigation';
import styles from './feriados.module.css';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
interface Holiday {
  date: Date;
  description: string;
  affectsWeekHours: boolean;
}

export default function HolidayScreen() {
  const router = useRouter();
  const [holidays] = useState<Holiday[]>([]);
  const [showHelpModal] = useState(false);
  const addHoliday = () => {
    // Funcionalidade desabilitada
  };

  const handleDateChange = () => {
    // Funcionalidade desabilitada
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaCalendar size={200} color="rgba(0,0,0,0.03)" />
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
            <h1 className={styles.title}>{CONSTANTES.TITULO_FERIADOS}</h1>
            <p className={styles.subtitle}>
              {CONSTANTES.SUBTITULO_FERIADOS}
            </p>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.addHolidayContainer}>
            <div className={styles.holidayText}>
              <h3 className={styles.holidayTitle}>Adicionar Feriado</h3>
              <p className={styles.holidayDescription}>
                Configure feriados para ajustar automaticamente sua jornada de trabalho
              </p>
              <div className={styles.comingSoonContainer}>
                <span className={styles.comingSoon}>{CONSTANTES.COMING_SOON}</span>
              </div>
            </div>
            <div className={styles.holidayControls}>
              <input
                type="text"
                className={`${styles.dateInput} ${styles.disabled}`}
                value=""
                onChange={handleDateChange}
                disabled
                placeholder="00/00/0000"
              />
              <button 
                className={`${styles.addButton} ${styles.disabled}`}
                onClick={addHoliday}
                disabled
              >
                <FaPlus size={16} />
                <span>{CONSTANTES.ADICIONAR_FERIADO}</span>
              </button>
            </div>
          </div>

          <div className={styles.holidayList}>
            {holidays.map((holiday, index) => (
              <motion.div 
                key={index} 
                className={styles.holidayCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className={styles.holidayInfo}>
                  <span className={styles.holidayDate}>
                    {holiday.date.toLocaleDateString('pt-BR')}
                  </span>
                  <span className={styles.holidayStatus}>
                    {holiday.affectsWeekHours 
                      ? 'Afeta jornada semanal (8h/dia)'
                      : 'Não afeta jornada semanal (8h48/dia)'}
                  </span>
                </div>
                <button 
                  className={`${styles.deleteButton} ${styles.disabled}`}
                  onClick={() => {}}
                  disabled
                >
                  <FaTrash size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <button 
          className={`${styles.helpButton} ${styles.disabled}`}
          onClick={() => {}}
          disabled
        >
          <FaQuestionCircle size={16} />
          <span>Como funciona?</span>
        </button>

        {showHelpModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{CONSTANTES.TITULO_COMO_FUNCIONA_FERIADOS}</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => {}}
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.helpSection}>
                  <h3>{CONSTANTES.TITULO_JORNADA_NORMAL_FERIADOS}</h3>
                  <p>{CONSTANTES.DESCRICAO_JORNADA_NORMAL_FERIADOS}</p>
                </div>

                <div className={styles.helpSection}>
                  <h3>{CONSTANTES.TITULO_FERIADOS_AOS_SABADOS}</h3>
                  <p>{CONSTANTES.DESCRICAO_FERIADOS_AOS_SABADOS}</p>
                </div>

                <div className={styles.helpSection}>
                  <h3>{CONSTANTES.TITULO_COMO_USAR_FERIADOS}</h3>
                  <p>
                    {CONSTANTES.DESCRICAO_COMO_USAR_FERIADOS_01}<br />
                    {CONSTANTES.DESCRICAO_COMO_USAR_FERIADOS_02}<br />
                    {CONSTANTES.DESCRICAO_COMO_USAR_FERIADOS_03}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
      
      <BottomNav />
    </div>
  );
}