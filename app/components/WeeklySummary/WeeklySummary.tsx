"use client";

import { motion } from 'framer-motion';
import { FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { TimeCalculationService } from '../../services/timeCalculationService';
import styles from './WeeklySummary.module.css';

export interface WeeklyStats {
  totalHours: number;
  averageHours: number;
  workedDays: number;
  overtimeHours: number;
}

export interface MonthlyStats {
  totalHours: number;
  averageHours: number;
  workedDays: number;
  overtimeHours: number;
  period: 'week' | 'month';
}

interface WeeklySummaryProps {
  stats: WeeklyStats | MonthlyStats;
  title?: string;
  className?: string;
}

const WeeklySummary = ({ 
  stats, 
  title = "Resumo Semanal",
  className = "" 
}: WeeklySummaryProps) => {
  const formatHours = (hours: number): string => {
    return TimeCalculationService.formatHours(hours);
  };

  // Determinar se é estatística semanal ou mensal
  const isMonthly = 'period' in stats && stats.period === 'month';
  const periodLabel = isMonthly ? 'Dias trabalhados no mês' : 'Dias trabalhados';

  return (
    <motion.section 
      className={`${styles.weeklyStats} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FiClock className={styles.statIcon} />
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatHours(stats.totalHours)}</span>
            <span className={styles.statLabel}>Total de horas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FiTrendingUp className={styles.statIcon} />
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatHours(stats.averageHours)}</span>
            <span className={styles.statLabel}>Média diária</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FiCalendar className={styles.statIcon} />
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.workedDays}</span>
            <span className={styles.statLabel}>{periodLabel}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FiClock className={styles.statIcon} />
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatHours(stats.overtimeHours)}</span>
            <span className={styles.statLabel}>Horas extras</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WeeklySummary; 