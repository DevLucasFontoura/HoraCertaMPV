"use client";

import { useEffect, useState } from 'react';
import BottomNav from '../../components/Menu/menu';
import styles from './bemvindo.module.css';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { registroService, DayRecord, TimeRecord } from '../../services/registroService';

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
  const { user, userData, loading } = useAuth();
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

  const formatWorkHours = (hours: number): string => {
    if (hours === 0) return '00:00';
    
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formatBankHours = (hours: number): string => {
    const absHours = Math.abs(hours);
    const h = Math.floor(absHours);
    const m = Math.round((absHours - h) * 60);
    const sign = hours < 0 ? '-' : '+';
    return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Calcular horas trabalhadas hoje
  const calculateTodayHours = (records: TimeRecord[]): number => {
    const types = records.map(r => r.type);
    
    if (!types.includes('entry') || !types.includes('exit')) {
      return 0;
    }

    const entry = records.find(r => r.type === 'entry');
    const exit = records.find(r => r.type === 'exit');
    const lunchOut = records.find(r => r.type === 'lunchOut');
    const lunchReturn = records.find(r => r.type === 'lunchReturn');
    
    if (!entry || !exit) return 0;
    
    const entryTime = new Date(`2000-01-01T${entry.time}:00`);
    const exitTime = new Date(`2000-01-01T${exit.time}:00`);
    let totalHours = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
    
    // Subtrair horário de almoço
    if (lunchOut && lunchReturn) {
      const lunchOutTime = new Date(`2000-01-01T${lunchOut.time}:00`);
      const lunchReturnTime = new Date(`2000-01-01T${lunchReturn.time}:00`);
      const lunchHours = (lunchReturnTime.getTime() - lunchOutTime.getTime()) / (1000 * 60 * 60);
      totalHours -= lunchHours;
    }
    
    return Math.round(totalHours * 10) / 10;
  };

  // Calcular banco de horas (últimos 30 dias)
  const calculateBankHours = (records: DayRecord[]): BankHours => {
    let totalPositive = 0;
    let totalNegative = 0;
    
    // Pegar registros dos últimos 30 dias
    const last30Days = records.slice(0, 30);
    
    last30Days.forEach(day => {
      const types = day.records.map(r => r.type);
      
      if (types.includes('entry') && types.includes('exit')) {
        const entry = day.records.find(r => r.type === 'entry');
        const exit = day.records.find(r => r.type === 'exit');
        const lunchOut = day.records.find(r => r.type === 'lunchOut');
        const lunchReturn = day.records.find(r => r.type === 'lunchReturn');
        
        if (entry && exit) {
          const entryTime = new Date(`2000-01-01T${entry.time}:00`);
          const exitTime = new Date(`2000-01-01T${exit.time}:00`);
          let dayHours = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
          
          // Subtrair horário de almoço
          if (lunchOut && lunchReturn) {
            const lunchOutTime = new Date(`2000-01-01T${lunchOut.time}:00`);
            const lunchReturnTime = new Date(`2000-01-01T${lunchReturn.time}:00`);
            const lunchHours = (lunchReturnTime.getTime() - lunchOutTime.getTime()) / (1000 * 60 * 60);
            dayHours -= lunchHours;
          }
          
          // Calcular diferença da jornada padrão (8h)
          const difference = dayHours - 8;
          
          if (difference > 0) {
            totalPositive += difference;
          } else if (difference < 0) {
            totalNegative += Math.abs(difference);
          }
        }
      }
    });
    
    return {
      total: Math.round((totalPositive - totalNegative) * 10) / 10,
      positive: Math.round(totalPositive * 10) / 10,
      negative: Math.round(totalNegative * 10) / 10
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        
        // Buscar registros do dia atual
        const todayRecords = await registroService.getRegistrosDoDia();
        const todayHours = calculateTodayHours(todayRecords);
        const isComplete = todayRecords.some(r => r.type === 'exit');
        
        setTodayStats({
          hoursWorked: todayHours,
          isComplete
        });
        
        // Buscar todos os registros para calcular banco de horas
        const allRecords = await registroService.getAllRegistros();
        const bankHoursData = calculateBankHours(allRecords);
        
        setBankHours(bankHoursData);
        
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!loading) {
      fetchStats();
    }
  }, [loading]);

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
              {statsLoading ? '--:--' : formatWorkHours(todayStats.hoursWorked)}
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
              {statsLoading ? '--:--' : formatBankHours(bankHours.total)}
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