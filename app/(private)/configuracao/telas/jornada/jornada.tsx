"use client";

import { CONSTANTES } from '../../../../common/constantes';
import BottomNav from '../../../../components/Menu/menu';
import { FaClock, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './jornada.module.css';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../hooks/useAuth';
import { AuthService } from '../../../../services/authService';

export default function WorkScheduleScreen() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Função para criar uma data base com apenas horas e minutos
  const createTimeDate = (hours: number, minutes: number) => {
    const date = new Date(2000, 0, 1); // 1 de Janeiro de 2000
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Inicializar com os dados do usuário ou valores padrão
  const getInitialWorkTime = () => {
    if (userData?.workHours) {
      const hours = Math.floor(userData.workHours);
      const minutes = Math.round((userData.workHours - hours) * 60);
      return createTimeDate(hours, minutes);
    }
    return createTimeDate(8, 0); // 8 horas padrão
  };

  const getInitialLunchTime = () => {
    if (userData?.lunchHours) {
      const hours = Math.floor(userData.lunchHours);
      const minutes = Math.round((userData.lunchHours - hours) * 60);
      return createTimeDate(hours, minutes);
    }
    return createTimeDate(1, 0); // 1 hora de almoço padrão
  };

  const initialWorkTime = getInitialWorkTime();
  const initialLunchTime = getInitialLunchTime();

  const [workTime, setWorkTime] = useState(initialWorkTime);
  const [lunchTime, setLunchTime] = useState(initialLunchTime);

  // Atualizar workTime e lunchTime quando userData carregar
  useEffect(() => {
    if (userData?.workHours) {
      const hours = Math.floor(userData.workHours);
      const minutes = Math.round((userData.workHours - hours) * 60);
      setWorkTime(createTimeDate(hours, minutes));
    }
    
    if (userData?.lunchHours) {
      const hours = Math.floor(userData.lunchHours);
      const minutes = Math.round((userData.lunchHours - hours) * 60);
      setLunchTime(createTimeDate(hours, minutes));
    }
  }, [userData]);

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

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Converter os tempos para horas decimais
      const workHoursDecimal = workTime.getHours() + (workTime.getMinutes() / 60);
      const lunchHoursDecimal = lunchTime.getHours() + (lunchTime.getMinutes() / 60);
      
      console.log('Salvando workHours:', workHoursDecimal, 'lunchHours:', lunchHoursDecimal); // Debug
      
      // Atualizar workHours e lunchHours no Firestore
      await AuthService.updateUserData(user.uid, {
        workHours: workHoursDecimal,
        lunchHours: lunchHoursDecimal
      });
      
      // Atualizar localStorage com os novos dados
      const updatedUserData = { ...userData, workHours: workHoursDecimal, lunchHours: lunchHoursDecimal };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Redirecionar para configuração
      router.push(CONSTANTES.ROUTE_CONFIGURACAO);
    } catch (error) {
      console.error('Erro ao salvar jornada de trabalho:', error);
      setError('Erro ao salvar alterações');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto carrega dados de autenticação
  if (authLoading) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.loadingState}>Carregando...</div>
        <BottomNav />
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.errorState}>{error}</div>
        <BottomNav />
      </div>
    );
  }

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
          disabled={loading}
        >
          {loading ? 'Salvando...' : CONSTANTES.BOTAO_SALVAR_ALTERACOES}
        </button>
      </motion.div>
      
      <BottomNav />
    </div>
  );
}