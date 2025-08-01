"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../../components/Menu/menu';
import styles from './bemvindo.module.css';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { registroService, TimeRecord } from '../../services/registroService';
import { TimeCalculationService, WorkTimeConfig } from '../../services/timeCalculationService';
import { FiClock, FiTrendingUp, FiCheckCircle, FiAlertCircle, FiCalendar, FiPlus } from 'react-icons/fi';

interface TodayStats {
  hoursWorked: number;
  isComplete: boolean;
  nextAction: string;
  currentStatus: 'working' | 'lunch' | 'finished' | 'not_started';
}

interface BankHours {
  total: number;
  positive: number;
  negative: number;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  isComplete: boolean;
}

const BemVindo = () => {
  const router = useRouter();
  const { userData, loading } = useAuth();
  const [todayStats, setTodayStats] = useState<TodayStats>({
    hoursWorked: 0,
    isComplete: false,
    nextAction: 'Registrar entrada',
    currentStatus: 'not_started'
  });
  const [bankHours, setBankHours] = useState<BankHours>({ total: 0, positive: 0, negative: 0 });
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ hours: 0, minutes: 0, isComplete: false });
  const [statsLoading, setStatsLoading] = useState(true);

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString('pt-BR', { month: 'long' });
  };

  // Obter configuração de jornada do usuário
  const getWorkTimeConfig = useCallback((): WorkTimeConfig => {
    return TimeCalculationService.getWorkTimeConfig(userData);
  }, [userData]);

  // Calcular tempo restante para completar a jornada
  const calculateTimeRemaining = useCallback((records: TimeRecord[], config: WorkTimeConfig): TimeRemaining => {
    const types = records.map((r: TimeRecord) => r.type);
    
    // Se não há entrada ou já foi finalizado, não há tempo restante
    if (!types.includes('entry') || types.includes('exit')) {
      return { hours: 0, minutes: 0, isComplete: true };
    }
    
    const entry = records.find((r: TimeRecord) => r.type === 'entry');
    if (!entry) {
      return { hours: 0, minutes: 0, isComplete: false };
    }
    
    // Calcular tempo já trabalhado
    const now = new Date();
    const entryTime = new Date();
    const [entryHours, entryMinutes] = entry.time.split(':').map(Number);
    entryTime.setHours(entryHours, entryMinutes, 0, 0);
    
    // Se ainda não chegou no horário de entrada
    if (now < entryTime) {
      return { hours: config.dailyWorkHours, minutes: 0, isComplete: false };
    }
    
    // Calcular tempo trabalhado até agora
    let workedMinutes = (now.getTime() - entryTime.getTime()) / (1000 * 60);
    
    // Descontar tempo de almoço se já saiu para almoço
    if (types.includes('lunchOut') && types.includes('lunchReturn')) {
      const lunchOut = records.find((r: TimeRecord) => r.type === 'lunchOut');
      const lunchReturn = records.find((r: TimeRecord) => r.type === 'lunchReturn');
      
      if (lunchOut && lunchReturn) {
        const lunchOutTime = new Date();
        const lunchReturnTime = new Date();
        const [lunchOutHours, lunchOutMinutes] = lunchOut.time.split(':').map(Number);
        const [lunchReturnHours, lunchReturnMinutes] = lunchReturn.time.split(':').map(Number);
        
        lunchOutTime.setHours(lunchOutHours, lunchOutMinutes, 0, 0);
        lunchReturnTime.setHours(lunchReturnHours, lunchReturnMinutes, 0, 0);
        
        const lunchMinutes = (lunchReturnTime.getTime() - lunchOutTime.getTime()) / (1000 * 60);
        workedMinutes -= lunchMinutes;
      }
    } else if (types.includes('lunchOut') && !types.includes('lunchReturn')) {
      // Se saiu para almoço mas não retornou, descontar tempo até agora
      const lunchOut = records.find((r: TimeRecord) => r.type === 'lunchOut');
      if (lunchOut) {
        const lunchOutTime = new Date();
        const [lunchOutHours, lunchOutMinutes] = lunchOut.time.split(':').map(Number);
        lunchOutTime.setHours(lunchOutHours, lunchOutMinutes, 0, 0);
        
        const lunchMinutes = (now.getTime() - lunchOutTime.getTime()) / (1000 * 60);
        workedMinutes -= lunchMinutes;
      }
    }
    
    // Calcular tempo restante
    const totalRequiredMinutes = config.dailyWorkHours * 60;
    const remainingMinutes = Math.max(0, totalRequiredMinutes - workedMinutes);
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = Math.round(remainingMinutes % 60);
    
    return { hours, minutes, isComplete: false };
  }, []);

  // Calcular status atual do dia
  const calculateTodayStatus = useCallback((records: TimeRecord[]): TodayStats => {
    const types = records.map((r: TimeRecord) => r.type);
    const config = getWorkTimeConfig();

    let currentStatus: 'working' | 'lunch' | 'finished' | 'not_started' = 'not_started';
    let nextAction = 'Registrar entrada';

    if (types.includes('entry')) {
      if (types.includes('exit')) {
        currentStatus = 'finished';
        nextAction = 'Dia finalizado';
      } else if (types.includes('lunchOut') && !types.includes('lunchReturn')) {
        currentStatus = 'lunch';
        nextAction = 'Registrar retorno do almoço';
      } else {
        currentStatus = 'working';
        if (types.includes('lunchReturn')) {
          nextAction = 'Registrar saída';
        } else {
          nextAction = 'Registrar saída para almoço';
        }
      }
    }

    const workTime = TimeCalculationService.calculateWorkTime(records, config);

    return {
      hoursWorked: workTime.workedHours,
      isComplete: workTime.isComplete,
      nextAction,
      currentStatus
    };
  }, [getWorkTimeConfig]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        if (!isMounted) return;
        setStatsLoading(true);

        const config = getWorkTimeConfig();

        // Buscar registros do dia atual
        const todayRecords = await registroService.getRegistrosDoDia();
        if (!isMounted) return;
        
        const todayStatus = calculateTodayStatus(todayRecords);
        const timeRemainingData = calculateTimeRemaining(todayRecords, config);

        if (isMounted) {
          setTodayStats(todayStatus);
          setTimeRemaining(timeRemainingData);
        }

        // Buscar registros do mês atual para calcular banco de horas
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() retorna 0-11
        
        const monthRecords = await registroService.getRegistrosDoMes(currentYear, currentMonth);
        if (!isMounted) return;
        
        const bankHoursData = TimeCalculationService.calculateBankHours(monthRecords, config);

        if (isMounted) {
          setBankHours({
            total: bankHoursData.total,
            positive: bankHoursData.positive,
            negative: bankHoursData.negative
          });
        }

      } catch (error) {
        if (isMounted) {
          console.error('Erro ao carregar estatísticas:', error);
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    if (!loading) {
      fetchStats();
    }
    
    // Cleanup function para evitar vazamentos de memória
    return () => {
      isMounted = false;
    };
  }, [loading, userData, calculateTodayStatus, getWorkTimeConfig, calculateTimeRemaining]);

  // Detectar mudança de mês e atualizar banco de horas
  useEffect(() => {
    let isMounted = true;
    let currentMonth = new Date().getMonth();
    
    const checkMonthChange = async () => {
      if (!isMounted || loading) return;
      
      const now = new Date();
      const newMonth = now.getMonth();
      
      // Verificar se mudou o mês
      if (newMonth !== currentMonth) {
        currentMonth = newMonth;
        
        try {
          const config = getWorkTimeConfig();
          const currentYear = now.getFullYear();
          const currentMonthNum = newMonth + 1;
          
          const monthRecords = await registroService.getRegistrosDoMes(currentYear, currentMonthNum);
          if (!isMounted) return;
          
          const bankHoursData = TimeCalculationService.calculateBankHours(monthRecords, config);
          
          if (isMounted) {
            setBankHours({
              total: bankHoursData.total,
              positive: bankHoursData.positive,
              negative: bankHoursData.negative
            });
          }
        } catch (error) {
          if (isMounted) {
            console.error('Erro ao atualizar banco de horas do mês:', error);
          }
        }
      }
    };

    // Verificar mudança de mês a cada hora
    const interval = setInterval(checkMonthChange, 3600000); // 1 hora

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [loading, userData, getWorkTimeConfig]);

  // Atualizar tempo restante a cada minuto
  useEffect(() => {
    if (todayStats.currentStatus !== 'not_started' && todayStats.currentStatus !== 'finished') {
      let isMounted = true;
      
      const updateTimeRemaining = () => {
        if (!isMounted) return;
        
        const config = getWorkTimeConfig();
        registroService.getRegistrosDoDia().then(todayRecords => {
          if (!isMounted) return;
          
          const timeRemainingData = calculateTimeRemaining(todayRecords, config);
          if (isMounted) {
            setTimeRemaining(timeRemainingData);
          }
        }).catch(error => {
          if (isMounted) {
            console.error('Erro ao atualizar tempo restante:', error);
          }
        });
      };

      // Atualizar imediatamente
      updateTimeRemaining();

      // Configurar intervalo para atualizar a cada minuto
      const interval = setInterval(updateTimeRemaining, 60000); // 60000ms = 1 minuto

      // Limpar intervalo quando componente for desmontado
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [todayStats.currentStatus, getWorkTimeConfig, calculateTimeRemaining]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <FiClock className={styles.statsIcon} />;
      case 'lunch':
        return <FiAlertCircle className={styles.statsIcon} />;
      case 'finished':
        return <FiCheckCircle className={styles.statsIcon} />;
      default:
        return <FiCalendar className={styles.statsIcon} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return styles.statusWorking;
      case 'lunch':
        return styles.statusLunch;
      case 'finished':
        return styles.statusFinished;
      default:
        return styles.statusNotStarted;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div
          className={styles.welcomeContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.welcomeHeader}>
            <span className={styles.welcomeText}>Bem vindo,</span>
            <span className={styles.nameText}>
              {loading ? 'Carregando...' : (
                userData?.name || 
                localStorage.getItem('userName') || 
                'Visitante'
              )}
            </span>
          </div>
          <motion.p
            className={styles.dateText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {formatDate()}
          </motion.p>
        </motion.div>
      </header>

      <div className={styles.content}>
        <div className={styles.statsContainer}>
          {/* Card de tempo restante - só mostra se o usuário já entrou e não finalizou */}
          {todayStats.currentStatus !== 'not_started' && todayStats.currentStatus !== 'finished' ? (
            <motion.div
              className={styles.timeRemainingCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className={styles.timeRemainingHeader}>
                <FiClock className={styles.timeRemainingIcon} />
                <span className={styles.timeRemainingTitle}>Tempo Restante</span>
              </div>
              <div className={styles.timeRemainingValue}>
                {statsLoading ? '--:--' : `${timeRemaining.hours}h ${timeRemaining.minutes}m`}
              </div>
              <div className={styles.timeRemainingSubtext}>
                Para completar sua jornada
              </div>
            </motion.div>
          ) : (
            <motion.div
              className={styles.statsCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className={styles.statsHeader}>
                <FiClock className={styles.statsIcon} />
                <span className={styles.statsLabel}>Horas Trabalhadas</span>
              </div>
              <div className={styles.statsValue}>
                {statsLoading ? '--:--' : TimeCalculationService.formatHours(todayStats.hoursWorked)}
              </div>
              <div className={styles.statsSubtext}>
                {todayStats.isComplete ? 'Dia finalizado' : 'Hoje'}
              </div>
            </motion.div>
          )}

          <motion.div
            className={styles.statsCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className={styles.statsHeader}>
              <FiPlus className={styles.statsIcon} />
              <span className={styles.statsLabel}>Saldo de Horas</span>
            </div>
            <div className={`${styles.statsValue} ${bankHours.total >= 0 ? styles.positive : styles.negative}`}>
              {statsLoading ? '--:--' : TimeCalculationService.formatBankHours(bankHours.total)}
            </div>
            <div className={styles.statsSubtext}>
              {bankHours.total >= 0 ? 'Crédito' : 'Débito'} • {getCurrentMonthName()}
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.statsCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className={styles.statsHeader}>
            {getStatusIcon(todayStats.currentStatus)}
            <span className={styles.statsLabel}>Próxima Ação</span>
          </div>
          <div className={`${styles.statsValue} ${getStatusColor(todayStats.currentStatus)}`}>
            {todayStats.nextAction}
          </div>
          <div className={styles.statsSubtext}>
            {todayStats.currentStatus === 'working' && 'Continue com o bom trabalho!'}
            {todayStats.currentStatus === 'lunch' && 'Aproveite seu almoço!'}
            {todayStats.currentStatus === 'finished' && 'Ótimo trabalho hoje!'}
            {todayStats.currentStatus === 'not_started' && 'Hora de começar o dia!'}
          </div>
        </motion.div>

        <motion.div
          className={styles.quickActions}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <motion.button
            className={styles.actionButton}
            onClick={() => router.push('/registrar-ponto')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiClock className={styles.actionIcon} />
            Registrar Ponto
          </motion.button>

          <motion.button
            className={`${styles.actionButton} ${styles.secondaryButton}`}
            onClick={() => router.push('/historico')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiTrendingUp className={styles.actionIcon} />
            Ver Histórico
          </motion.button>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BemVindo;