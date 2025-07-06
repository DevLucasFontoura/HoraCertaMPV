import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
import { FaClock, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './jornada.module.css';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WorkScheduleScreen() {
  const router = useRouter();
  
  // Função para criar uma data base com apenas horas e minutos
  const createTimeDate = (hours: number, minutes: number) => {
    const date = new Date(2000, 0, 1); // 1 de Janeiro de 2000
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const initialWorkTime = createTimeDate(8, 0);
  const initialLunchTime = createTimeDate(1, 0);

  const [workTime, setWorkTime] = useState(initialWorkTime);
  const [lunchTime, setLunchTime] = useState(initialLunchTime);

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleWorkTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    setWorkTime(createTimeDate(hours, minutes));
  };

  const handleLunchTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    setLunchTime(createTimeDate(hours, minutes));
  };

  const handleSave = () => {
    // Implementar lógica de salvamento
    router.push(CONSTANTES.ROUTE_CONFIGURACAO);
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.backgroundIcon}>
        <FaClock size={200} color="rgba(0,0,0,0.03)" />
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
            <h1 className={styles.title}>{CONSTANTES.TITULO_JORNADA_DE_TRABALHO}</h1>
            <p className={styles.subtitle}>{CONSTANTES.SUBTITULO_JORNADA_DE_TRABALHO}</p>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.scheduleItem}>
            <div className={styles.scheduleInfo}>
              <h3 className={styles.scheduleTitle}>{CONSTANTES.TITULO_CARDS_CARGA_HORARIA_DIARIA}</h3>
              <p className={styles.scheduleDescription}>
                {CONSTANTES.DESCRICAO_CARDS_CARGA_HORARIA_DIARIA}
              </p>
            </div>
            <input
              type="time"
              className={styles.timeInput}
              value={formatTime(workTime)}
              onChange={handleWorkTimeChange}
            />
          </div>

          <div className={styles.scheduleItem}>
            <div className={styles.scheduleInfo}>
              <h3 className={styles.scheduleTitle}>{CONSTANTES.TITULO_CARDS_HORARIO_ALMOCO}</h3>
              <p className={styles.scheduleDescription}>
                {CONSTANTES.DESCRICAO_CARDS_HORARIO_ALMOCO}
              </p>
            </div>
            <input
              type="time"
              className={styles.timeInput}
              value={formatTime(lunchTime)}
              onChange={handleLunchTimeChange}
            />
          </div>
        </section>

        <button 
          className={styles.actionButton}
          onClick={handleSave}
        >
          {CONSTANTES.BOTAO_SALVAR_ALTERACOES}
        </button>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}