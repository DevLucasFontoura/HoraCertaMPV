'use client';

import { FaCalendar, FaArrowLeft, FaPlus, FaTrash, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
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
  const navigate = useRouter();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const addHoliday = () => {
    if (!selectedDate) return;
    
    const date = new Date(selectedDate);
    const isSaturday = date.getDay() === 6;
    const newHoliday: Holiday = {
      date,
      description: 'Feriado',
      affectsWeekHours: isSaturday
    };
    setHolidays([...holidays, newHoliday]);
    setSelectedDate('');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
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
            <input
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              onChange={handleDateChange}
            />
            <button 
              className={styles.addButton}
              onClick={addHoliday}
              disabled={!selectedDate}
            >
              <FaPlus size={16} />
              <span>{CONSTANTES.ADICIONAR_FERIADO}</span>
            </button>
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
                  className={styles.deleteButton}
                  onClick={() => {
                    const newHolidays = holidays.filter((_, i) => i !== index);
                    setHolidays(newHolidays);
                  }}
                >
                  <FaTrash size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <button 
          className={styles.helpButton}
          onClick={() => setShowHelpModal(true)}
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
                  onClick={() => setShowHelpModal(false)}
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