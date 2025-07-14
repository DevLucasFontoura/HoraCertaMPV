"use client";

import { useEffect, useState, useCallback } from 'react';
import BottomNav from '../../components/Menu/menu';
import styles from './bemvindo.module.css';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { registroService } from '../../services/registroService';
import { TimeCalculationService, WorkTimeConfig } from '../../services/timeCalculationService';

interface TodayStats {
  hoursWorked: number;
  isComplete: boolean;
}

interface BankHours {
  total: number;
  positive: number;
  negative: number;
}

const BemVindo = () => {
  const { userData, loading } = useAuth();
  const [todayStats, setTodayStats] = useState<TodayStats>({ hoursWorked: 0, isComplete: false });
  const [bankHours, setBankHours] = useState<BankHours>({ total: 0, positive: 0, negative: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Obter configuração de jornada do usuário
  const getWorkTimeConfig = useCallback((): WorkTimeConfig => {
    return TimeCalculationService.getWorkTimeConfig(userData);
  }, [userData]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        
        const config = getWorkTimeConfig();
        
        // Buscar registros do dia atual
        const todayRecords = await registroService.getRegistrosDoDia();
        const todayWorkTime = TimeCalculationService.calculateWorkTime(todayRecords, config);
        
        setTodayStats({
          hoursWorked: todayWorkTime.workedHours,
          isComplete: todayWorkTime.isComplete
        });
        
        // Buscar todos os registros para calcular banco de horas
        const allRecords = await registroService.getAllRegistros();
        const last30Days = allRecords.slice(0, 30); // últimos 30 dias
        const bankHoursData = TimeCalculationService.calculateBankHours(last30Days, config);
        
        setBankHours({
          total: bankHoursData.total,
          positive: bankHoursData.positive,
          negative: bankHoursData.negative
        });
        
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!loading) {
      fetchStats();
    }
  }, [loading, userData]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          className={styles.welcomeContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.welcomeHeader}>
            <span className={styles.welcomeText}>Bem vindo,</span>
            <span className={styles.nameText}>
              {loading ? 'Carregando...' : (userData?.name || 'Visitante')}
            </span>
          </div>
          <motion.p 
            className={styles.dateText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
          >
            {formatDate()}
          </motion.p>
        </motion.div>
      </header>

      <div className={styles.content}>
        <div className={styles.statsContainer}>
          <motion.div 
            className={`${styles.statsCard} ${styles.workCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.statsHeader}>
              <div className={styles.dot} />
              <span className={styles.statsLabel}>Horas Trabalhadas</span>
            </div>
            <div className={styles.statsValue}>
              {statsLoading ? '--:--' : TimeCalculationService.formatHours(todayStats.hoursWorked)}
            </div>
            <div className={styles.statsSubtext}>
              {todayStats.isComplete ? 'Dia finalizado' : 'Hoje'}
            </div>
          </motion.div>

          <motion.div 
            className={`${styles.statsCard} ${styles.balanceCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.statsHeader}>
              <div className={styles.dot} />
              <span className={styles.statsLabel}>Banco de Horas</span>
            </div>
            <div className={`${styles.statsValue} ${bankHours.total >= 0 ? styles.positive : styles.negative}`}>
              {statsLoading ? '--:--' : TimeCalculationService.formatBankHours(bankHours.total)}
            </div>
            <div className={styles.statsSubtext}>
              {bankHours.total >= 0 ? 'Crédito' : 'Débito'} • 30 dias
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BemVindo;