"use client";

import LineChart from '../../components/Graficos/graficoDeLinha';
import { CONSTANTES } from '../../common/constantes';
import BottomNav from '../../components/Menu/menu';
import { useState, useEffect, useCallback } from 'react';
import styles from './dashboard.module.css';
import { motion } from 'framer-motion';
import { registroService, DayRecord, TimeRecord } from '../../services/registroService';
import { TimeCalculationService, WorkTimeConfig } from '../../services/timeCalculationService';
import { useAuth } from '../../hooks/useAuth';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import WeeklySummary, { MonthlyStats } from '../../components/WeeklySummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../lib/utils';

interface DashboardData {
  monthlyHours: { data: number[]; labels: string[] } | null;
  monthlyComparison: { data: number[]; labels: string[] } | null;
  overtimeBank: { data: number[]; labels: string[] } | null;
}

interface TodayStatus {
  currentStatus: 'working' | 'lunch' | 'finished' | 'not_started';
  nextAction: string;
  totalHoursToday: number;
  lastPunch: string;
  isOnTime: boolean;
}

const Dashboard = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [showWeekends, setShowWeekends] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthlyHours: null,
    monthlyComparison: null,
    overtimeBank: null
  });
  const [todayStatus, setTodayStatus] = useState<TodayStatus>({
    currentStatus: 'not_started',
    nextAction: 'Registrar entrada',
    totalHoursToday: 0,
    lastPunch: '',
    isOnTime: true
  });
  // Removido weeklyStats pois não está sendo usado
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalHours: 0,
    averageHours: 0,
    workedDays: 0,
    overtimeHours: 0,
    period: 'month'
  });

  // Estados para seleção de ano e mês
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Gerar arrays de anos e meses disponíveis
  const generateYears = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Gerar anos de 2020 até o ano atual + 1
    for (let year = 2020; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  }, []);

  const generateMonths = useCallback(() => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      months.push(month);
    }
    return months;
  }, []);

  const years = generateYears();
  const months = generateMonths();

  // Funções para lidar com mudanças de ano e mês
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  // Obter configuração de jornada do usuário
  const getWorkTimeConfig = useCallback((): WorkTimeConfig => {
    return TimeCalculationService.getWorkTimeConfig(userData);
  }, [userData]);

  // Função para calcular status atual do dia
  const calculateTodayStatus = useCallback((records: TimeRecord[]): TodayStatus => {
    const types = records.map(r => r.type);
    const lastRecord = records[records.length - 1];
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

    // Calcular horas trabalhadas hoje usando o novo serviço
    const workTime = TimeCalculationService.calculateWorkTime(records, config);
    const totalHoursToday = workTime.workedHours;

    // Verificar se está no horário (entrada antes das 9h)
    const entryRecord = records.find(r => r.type === 'entry');
    const isOnTime = !types.includes('entry') || 
      (types.includes('entry') && entryRecord ? entryRecord.time <= '09:00' : false);

    return {
      currentStatus,
      nextAction,
      totalHoursToday,
      lastPunch: lastRecord ? lastRecord.time : '',
      isOnTime
    };
  }, [getWorkTimeConfig]);

  // Removida função calculateWeeklyStats pois não está sendo usada

  // Função para calcular estatísticas do mês selecionado
  const calculateMonthlyStats = useCallback((allRecords: DayRecord[]): MonthlyStats => {
    const config = getWorkTimeConfig();
    
    // Filtrar registros do mês selecionado
    const monthRecords = allRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth - 1 && recordDate.getFullYear() === selectedYear;
    });
    
    const stats = TimeCalculationService.calculateMonthlyStats(monthRecords, config);
    
    return {
      totalHours: stats.totalWorkedHours,
      averageHours: stats.averageDailyHours,
      workedDays: stats.workedDays,
      overtimeHours: stats.totalOvertimeHours,
      period: 'month'
    };
  }, [getWorkTimeConfig, selectedYear, selectedMonth]);

  // Função para gerar dados dos gráficos
  const generateChartData = useCallback((records: DayRecord[]) => {
    const config = getWorkTimeConfig();
    
    // Gerar dados para todos os dias do mês selecionado
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    
    // Criar array com todos os dias do mês
    const monthlyData: number[] = [];
    const monthlyLabels: string[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Verificar se é final de semana (0 = domingo, 6 = sábado)
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Se não mostrar finais de semana e for final de semana, pular
      if (!showWeekends && isWeekend) {
        continue;
      }
      
      // Buscar registros para este dia específico
      const dayRecords = records.find(record => record.date === dateString);
      
      if (dayRecords) {
        const workTime = TimeCalculationService.calculateWorkTime(dayRecords.records, config);
        monthlyData.push(workTime.workedHours);
      } else {
        monthlyData.push(0);
      }
      
      // Criar label para o dia com dia da semana
      const label = date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
      monthlyLabels.push(label);
    }

    return {
      monthlyHours: { data: monthlyData, labels: monthlyLabels }
    };
  }, [getWorkTimeConfig, showWeekends, selectedYear, selectedMonth]);

  // Estado para armazenar todos os registros
  const [allRecords, setAllRecords] = useState<DayRecord[]>([]);

  // useEffect para carregar dados iniciais
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
        const allRecordsData = await registroService.getAllRegistros();
        setAllRecords(allRecordsData);
        
        // Removido cálculo de estatísticas semanais pois não está sendo usado
        
        // Calcular estatísticas do mês atual
        const monthlyStats = calculateMonthlyStats(allRecordsData);
        setMonthlyStats(monthlyStats);
        
        // Gerar dados dos gráficos
        const chartData = generateChartData(allRecordsData);
        
        setDashboardData({
          monthlyHours: chartData.monthlyHours,
          monthlyComparison: null, // Implementar quando necessário
          overtimeBank: null // Implementar quando necessário
        });
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [calculateTodayStatus, calculateMonthlyStats, generateChartData]);

  // useEffect separado para atualizar apenas o gráfico quando showWeekends mudar
  useEffect(() => {
    if (allRecords.length > 0) {
      setChartLoading(true);
      // Pequeno delay para mostrar o loading
      setTimeout(() => {
        const chartData = generateChartData(allRecords);
        setDashboardData(prev => ({
          ...prev,
          monthlyHours: chartData.monthlyHours
        }));
        setChartLoading(false);
      }, 100);
    }
  }, [showWeekends, selectedYear, selectedMonth, generateChartData, allRecords]);

  // useEffect para atualizar dados quando ano ou mês mudar
  useEffect(() => {
    if (allRecords.length > 0) {
      setChartLoading(true);
      // Pequeno delay para mostrar o loading
      setTimeout(() => {
        // Recalcular estatísticas do mês
        const monthlyStats = calculateMonthlyStats(allRecords);
        setMonthlyStats(monthlyStats);
        
        // Regenerar dados do gráfico
        const chartData = generateChartData(allRecords);
        setDashboardData(prev => ({
          ...prev,
          monthlyHours: chartData.monthlyHours
        }));
        setChartLoading(false);
      }, 100);
    }
  }, [selectedYear, selectedMonth, allRecords, calculateMonthlyStats, generateChartData]);

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
    return TimeCalculationService.formatHours(hours);
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

            {/* Seletor de ano e mês */}
            <motion.section 
              className={styles.monthSelector}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.selectorHeader}>
                <h2 className={styles.selectorTitle}>Período</h2>
                <div className={styles.selectorControls}>
                  <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
                    <SelectTrigger className={cn(styles.yearSelect)}>
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent className={cn(styles.selectContent)}>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedMonth.toString()} onValueChange={(value) => handleMonthChange(parseInt(value))}>
                    <SelectTrigger className={cn(styles.monthSelect)}>
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent className={cn(styles.selectContent)}>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2000, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.section>

            {/* Estatísticas mensais */}
            <WeeklySummary 
              stats={monthlyStats} 
              title={`Resumo de ${new Date(2000, selectedMonth - 1).toLocaleDateString('pt-BR', { month: 'long' })} de ${selectedYear}`}
            />

            <div className={styles.grid}>
              <motion.section 
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.chartHeader}>
                  <h2 className={styles.sectionTitle}>Horas de {new Date(2000, selectedMonth - 1).toLocaleDateString('pt-BR', { month: 'long' })} de {selectedYear}</h2>
                  <div className={styles.chartControls}>
                    <label className={styles.weekendToggle}>
                      <input
                        type="checkbox"
                        checked={showWeekends}
                        onChange={(e) => setShowWeekends(e.target.checked)}
                        className={styles.weekendCheckbox}
                      />
                      <span className={styles.weekendLabel}>Mostrar finais de semana</span>
                    </label>
                  </div>
                </div>
                <div className={styles.chartContainer}>
                  {chartLoading ? (
                    <div className={styles.chartLoading}>
                      <div className={styles.loadingSpinner}></div>
                      <span>Atualizando gráfico...</span>
                    </div>
                  ) : dashboardData.monthlyHours ? (
                    <LineChart 
                      data={dashboardData.monthlyHours.data}
                      labels={dashboardData.monthlyHours.labels}
                      title="Horas Trabalhadas"
                    />
                  ) : renderEmptyState()}
                </div>
              </motion.section>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;