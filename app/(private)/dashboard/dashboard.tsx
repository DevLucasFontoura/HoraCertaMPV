"use client";

import HabitTracker from '../../components/HabitTracker/HabitTracker';

import LineChart from '../../components/Graficos/graficoDeLinha';
import { CONSTANTES } from '../../common/constantes';
import BottomNav from '../../components/Menu/menu';
import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { motion } from 'framer-motion';
import { registroService, DayRecord, TimeRecord } from '../../services/registroService';
import { FiClock, FiCalendar, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface DashboardData {
  weeklyHours: { data: number[]; labels: string[] } | null;
  monthlyComparison: { data: number[]; labels: string[] } | null;
  punchHistory: boolean[] | null;
  overtimeBank: { data: number[]; labels: string[] } | null;
}

interface TodayStatus {
  currentStatus: 'working' | 'lunch' | 'finished' | 'not_started';
  nextAction: string;
  totalHoursToday: number;
  lastPunch: string;
  isOnTime: boolean;
}

interface WeeklyStats {
  totalHours: number;
  averageHours: number;
  workedDays: number;
  overtimeHours: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    weeklyHours: null,
    monthlyComparison: null,
    punchHistory: null,
    overtimeBank: null
  });
  const [todayStatus, setTodayStatus] = useState<TodayStatus>({
    currentStatus: 'not_started',
    nextAction: 'Registrar entrada',
    totalHoursToday: 0,
    lastPunch: '',
    isOnTime: true
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalHours: 0,
    averageHours: 0,
    workedDays: 0,
    overtimeHours: 0
  });


  // Função para calcular status atual do dia
  const calculateTodayStatus = (records: TimeRecord[]): TodayStatus => {
    const types = records.map(r => r.type);
    const lastRecord = records[records.length - 1];
    
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

    // Calcular horas trabalhadas hoje
    let totalHoursToday = 0;
    if (types.includes('entry') && types.includes('exit')) {
      const entry = records.find(r => r.type === 'entry');
      const exit = records.find(r => r.type === 'exit');
      const lunchOut = records.find(r => r.type === 'lunchOut');
      const lunchReturn = records.find(r => r.type === 'lunchReturn');
      
      if (entry && exit) {
        const entryTime = new Date(`2000-01-01T${entry.time}:00`);
        const exitTime = new Date(`2000-01-01T${exit.time}:00`);
        totalHoursToday = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
        
        // Subtrair horário de almoço
        if (lunchOut && lunchReturn) {
          const lunchOutTime = new Date(`2000-01-01T${lunchOut.time}:00`);
          const lunchReturnTime = new Date(`2000-01-01T${lunchReturn.time}:00`);
          const lunchHours = (lunchReturnTime.getTime() - lunchOutTime.getTime()) / (1000 * 60 * 60);
          totalHoursToday -= lunchHours;
        }
      }
    }

    // Verificar se está no horário (entrada antes das 9h)
    const entryRecord = records.find(r => r.type === 'entry');
    const isOnTime = !types.includes('entry') || 
      (types.includes('entry') && entryRecord ? entryRecord.time <= '09:00' : false);

    return {
      currentStatus,
      nextAction,
      totalHoursToday: Math.round(totalHoursToday * 10) / 10,
      lastPunch: lastRecord ? lastRecord.time : '',
      isOnTime
    };
  };

  // Função para calcular estatísticas semanais
  const calculateWeeklyStats = (weekRecords: DayRecord[]): WeeklyStats => {
    let totalHours = 0;
    let workedDays = 0;
    let overtimeHours = 0;
    
    weekRecords.forEach(day => {
      const types = day.records.map(r => r.type);
      if (types.includes('entry') && types.includes('exit')) {
        workedDays++;
        
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
          
          totalHours += dayHours;
          
          // Calcular horas extras (acima de 8h)
          if (dayHours > 8) {
            overtimeHours += dayHours - 8;
          }
        }
      }
    });
    
    return {
      totalHours: Math.round(totalHours * 10) / 10,
      averageHours: workedDays > 0 ? Math.round((totalHours / workedDays) * 10) / 10 : 0,
      workedDays,
      overtimeHours: Math.round(overtimeHours * 10) / 10
    };
  };

  // Função para gerar dados dos gráficos
  const generateChartData = (records: DayRecord[]) => {
    // Dados semanais (últimos 7 dias)
    const last7Days = records.slice(0, 7).reverse();
    const weeklyData = last7Days.map(day => {
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
          
          if (lunchOut && lunchReturn) {
            const lunchOutTime = new Date(`2000-01-01T${lunchOut.time}:00`);
            const lunchReturnTime = new Date(`2000-01-01T${lunchReturn.time}:00`);
            const lunchHours = (lunchReturnTime.getTime() - lunchOutTime.getTime()) / (1000 * 60 * 60);
            dayHours -= lunchHours;
          }
          
          return Math.round(dayHours * 10) / 10;
        }
      }
      return 0;
    });
    
    const weeklyLabels = last7Days.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
    });

    // Histórico de pontos (últimos 30 dias)
    const last30Days = records.slice(0, 30).reverse();
    const punchHistory = last30Days.map(day => {
      const types = day.records.map(r => r.type);
      return types.includes('entry') && types.includes('exit');
    });

    return {
      weeklyHours: { data: weeklyData, labels: weeklyLabels },
      punchHistory: punchHistory
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar registros do dia atual
        const todayRecords = await registroService.getRegistrosDoDia();
        
        // Calcular status do dia
        const todayStatus = calculateTodayStatus(todayRecords);
        setTodayStatus(todayStatus);
        
        // Buscar todos os registros para estatísticas
        const allRecords = await registroService.getAllRegistros();
        
        // Calcular estatísticas semanais (últimos 7 dias)
        const weekRecords = allRecords.slice(0, 7);
        const weeklyStats = calculateWeeklyStats(weekRecords);
        setWeeklyStats(weeklyStats);
        
        // Gerar dados dos gráficos
        const chartData = generateChartData(allRecords);
        
        setDashboardData({
          weeklyHours: chartData.weeklyHours,
          monthlyComparison: null, // Implementar quando necessário
          punchHistory: chartData.punchHistory,
          overtimeBank: null // Implementar quando necessário
        });
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <p className={styles.emptyText}>Nenhum dado disponível</p>
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <FiClock className={styles.statusIconWorking} />;
      case 'lunch':
        return <FiClock className={styles.statusIconLunch} />;
      case 'finished':
        return <FiCheckCircle className={styles.statusIconFinished} />;
      default:
        return <FiAlertCircle className={styles.statusIconNotStarted} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return 'Trabalhando';
      case 'lunch':
        return 'No almoço';
      case 'finished':
        return 'Dia finalizado';
      default:
        return 'Não iniciado';
    }
  };

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}m`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {CONSTANTES.TITULO_DASHBOARD}
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
          >
            {CONSTANTES.SUBTITULO_DASHBOARD}
          </motion.p>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <>
            {/* Status do dia atual */}
            <motion.section 
              className={styles.todayStatus}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.statusHeader}>
                <h2 className={styles.statusTitle}>Status do Dia</h2>
                <div className={styles.statusIndicator}>
                  {getStatusIcon(todayStatus.currentStatus)}
                  <span className={styles.statusText}>{getStatusText(todayStatus.currentStatus)}</span>
                </div>
              </div>
              
              <div className={styles.statusDetails}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Próxima ação:</span>
                  <span className={styles.statusValue}>{todayStatus.nextAction}</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Horas hoje:</span>
                  <span className={styles.statusValue}>
                    {todayStatus.totalHoursToday > 0 ? formatHours(todayStatus.totalHoursToday) : '--'}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Último ponto:</span>
                  <span className={styles.statusValue}>
                    {todayStatus.lastPunch || '--'}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>No horário:</span>
                  <span className={`${styles.statusValue} ${todayStatus.isOnTime ? styles.onTime : styles.late}`}>
                    {todayStatus.isOnTime ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Estatísticas semanais */}
            <motion.section 
              className={styles.weeklyStats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className={styles.sectionTitle}>Resumo Semanal</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <FiClock className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{formatHours(weeklyStats.totalHours)}</span>
                    <span className={styles.statLabel}>Total de horas</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <FiTrendingUp className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{formatHours(weeklyStats.averageHours)}</span>
                    <span className={styles.statLabel}>Média diária</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <FiCalendar className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{weeklyStats.workedDays}</span>
                    <span className={styles.statLabel}>Dias trabalhados</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <FiClock className={styles.statIcon} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{formatHours(weeklyStats.overtimeHours)}</span>
                    <span className={styles.statLabel}>Horas extras</span>
                  </div>
                </div>
              </div>
            </motion.section>

            <div className={styles.grid}>
              <div className={styles.row}>
                <motion.section 
                  className={styles.section}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className={styles.sectionTitle}>Horas Semanais</h2>
                  <div className={styles.chartContainer}>
                    {dashboardData.weeklyHours ? (
                      <LineChart 
                        data={dashboardData.weeklyHours.data}
                        labels={dashboardData.weeklyHours.labels}
                        title="Horas Trabalhadas"
                      />
                    ) : renderEmptyState()}
                  </div>
                </motion.section>

                <motion.section 
                  className={styles.section}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className={styles.sectionTitle}>Pontos Registrados</h2>
                  <div className={styles.chartContainer}>
                    {dashboardData.punchHistory ? (
                      <HabitTracker 
                        data={dashboardData.punchHistory}
                        title="Pontos Registrados"
                      />
                    ) : renderEmptyState()}
                  </div>
                </motion.section>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;