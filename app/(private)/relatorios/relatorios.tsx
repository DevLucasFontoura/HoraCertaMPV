"use client";

import { FiClock, FiCalendar, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { IoStatsChartOutline } from 'react-icons/io5'
import BottomNav from '../../components/Menu/menu';
import styles from './relatorios.module.css';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { registroService, DayRecord, TimeRecord } from '../../services/registroService';
import { TimeCalculationService, WorkTimeConfig } from '../../services/timeCalculationService';
import { useAuth } from '../../hooks/useAuth';

interface ProcessedTimeRecord {
  id: string;
  date: string;
  entry: string;
  lunchOut: string;
  lunchReturn: string;
  exit: string;
  total: string;
}

interface TimeRecordItemProps {
  record: ProcessedTimeRecord;
}

interface DayGroup {
  day: string;
  records: ProcessedTimeRecord[];
}

interface MonthGroup {
  month: string;
  days: DayGroup[];
}

// Função utilitária para formatar horas
const formatHours = (totalHours: number): string => {
  return TimeCalculationService.formatHours(totalHours);
};

const StatsCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
  return (
    <motion.div
      className={styles.statsCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.statsIcon}>{icon}</div>
      <div className={styles.statsContent}>
        <div className={styles.statsLabel}>{label}</div>
        <div className={styles.statsValue}>{value}</div>
      </div>
    </motion.div>
  );
};

const TimeRecordItem = ({ record }: TimeRecordItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState(record);
  const { user, userData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEdit = async () => {
    if (isEditing) {
      setSaving(true);
      setError(null);
      setSuccess(false);
      try {
        if (!user || !userData) {
          setError('Usuário não autenticado!');
          setSaving(false);
          return;
        }
        // Montar array de records no formato esperado
        const records: TimeRecord[] = [
          editedRecord.entry && { type: 'entry', time: editedRecord.entry, label: 'Entrada', timestamp: new Date() },
          editedRecord.lunchOut && { type: 'lunchOut', time: editedRecord.lunchOut, label: 'Saída Almoço', timestamp: new Date() },
          editedRecord.lunchReturn && { type: 'lunchReturn', time: editedRecord.lunchReturn, label: 'Retorno Almoço', timestamp: new Date() },
          editedRecord.exit && { type: 'exit', time: editedRecord.exit, label: 'Saída', timestamp: new Date() }
        ].filter(Boolean) as TimeRecord[];
        // Converter data para YYYY-MM-DD
        const [day, month, year] = editedRecord.date.split('/');
        const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        await registroService.atualizarRegistro(user.uid, dateStr, records);
        setSuccess(true);
      } catch {
        setError('Erro ao salvar alterações!');
      } finally {
        setSaving(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleTimeChange = (field: keyof ProcessedTimeRecord, value: string) => {
    setEditedRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isEmpty =
    !record.entry && !record.lunchOut && !record.lunchReturn && !record.exit;

  return (
    <motion.div 
      className={styles.recordCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.recordRow}>
        <span className={styles.recordLabel}>Data</span>
        <span className={styles.recordValue}>{record.date}</span>
      </div>
      <div className={styles.recordRow}>
        <span className={styles.recordLabel}>Entrada</span>
        {isEditing ? (
          <input
            type="time"
            value={editedRecord.entry}
            onChange={(e) => handleTimeChange('entry', e.target.value)}
            className={styles.timeInput}
          />
        ) : (
          <span className={styles.recordValue}>{record.entry || '--:--'}</span>
        )}
      </div>
      <div className={styles.recordRow}>
        <span className={styles.recordLabel}>Saída Almoço</span>
        {isEditing ? (
          <input
            type="time"
            value={editedRecord.lunchOut}
            onChange={(e) => handleTimeChange('lunchOut', e.target.value)}
            className={styles.timeInput}
          />
        ) : (
          <span className={styles.recordValue}>{record.lunchOut || '--:--'}</span>
        )}
      </div>
      <div className={styles.recordRow}>
        <span className={styles.recordLabel}>Retorno Almoço</span>
        {isEditing ? (
          <input
            type="time"
            value={editedRecord.lunchReturn}
            onChange={(e) => handleTimeChange('lunchReturn', e.target.value)}
            className={styles.timeInput}
          />
        ) : (
          <span className={styles.recordValue}>{record.lunchReturn || '--:--'}</span>
        )}
      </div>
      <div className={styles.recordRow}>
        <span className={styles.recordLabel}>Saída</span>
        {isEditing ? (
          <input
            type="time"
            value={editedRecord.exit}
            onChange={(e) => handleTimeChange('exit', e.target.value)}
            className={styles.timeInput}
          />
        ) : (
          <span className={styles.recordValue}>{record.exit || '--:--'}</span>
        )}
      </div>
      <div className={`${styles.recordRow} ${styles.totalRow}`}>
        <span className={styles.recordLabel}>Total</span>
        <span className={styles.recordValue}>{record.total || '--:--'}</span>
      </div>
      <div className={styles.dangerZone}>
        <button
          onClick={handleEdit}
          className={styles.editButton}
          disabled={saving || isEmpty}
        >
          {isEditing ? (saving ? 'Salvando...' : 'Salvar') : 'Editar'}
        </button>
        {isEmpty && (
          <span className={styles.infoText}>
            Só é possível editar registros já salvos.
          </span>
        )}
        {error && <span className={styles.errorText}>{error}</span>}
        {success && <span className={styles.successText}>Salvo!</span>}
      </div>
    </motion.div>
  );
};

const DayRecordGroup = ({ day, records }: DayGroup) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalHours = records.reduce((acc, record) => {
    // Parsear formato "8h19m" ou "8h"
    const totalStr = record.total;
    if (!totalStr) return acc;
    
    const hoursMatch = totalStr.match(/(\d+)h/);
    const minutesMatch = totalStr.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    return acc + hours + (minutes / 60);
  }, 0);

  return (
    <div className={styles.dayGroup}>
      <button 
        className={styles.dayHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.dayInfo}>
          <h4 className={styles.dayTitle}>{day}</h4>
          <span className={styles.dayStats}>
            {records.length} registros • {formatHours(totalHours)}
          </span>
        </div>
        {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {records.map((record) => (
            <TimeRecordItem key={record.id} record={record} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const MonthlyRecordGroup = ({ month, days }: MonthGroup) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalRecords = days.reduce((acc, day) => acc + day.records.length, 0);
  const totalHours = days.reduce((acc, day) => 
    acc + day.records.reduce((sum, record) => {
      // Parsear formato "8h19m" ou "8h"
      const totalStr = record.total;
      if (!totalStr) return sum;
      
      const hoursMatch = totalStr.match(/(\d+)h/);
      const minutesMatch = totalStr.match(/(\d+)m/);
      
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      
      return sum + hours + (minutes / 60);
    }, 0), 0
  );

  return (
    <motion.div 
      className={styles.monthGroup}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button 
        className={styles.monthHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.monthInfo}>
          <h3 className={styles.monthTitle}>{month}</h3>
          <span className={styles.monthStats}>
            {totalRecords} registros • {formatHours(totalHours)} totais
          </span>
        </div>
        {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={styles.daysContainer}
        >
          {days.map((day) => (
            <DayRecordGroup key={day.day} {...day} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default function ReportsScreen() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState<ProcessedTimeRecord[]>([]);
  const [reports, setReports] = useState<ProcessedTimeRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<{
    totalHours: number | null;
    dailyAverage: number | null;
    workedDays: number | null;
  }>({
    totalHours: null,
    dailyAverage: null,
    workedDays: null
  });

  // Obter configuração de jornada do usuário
  const getWorkTimeConfig = useCallback((): WorkTimeConfig => {
    return TimeCalculationService.getWorkTimeConfig(userData);
  }, [userData]);

  // Função para converter dados do Firebase para o formato da interface
  const processDayRecord = useCallback((dayRecord: DayRecord): ProcessedTimeRecord => {
    const records = dayRecord.records;
    const entry = records.find(r => r.type === 'entry')?.time || '';
    const lunchOut = records.find(r => r.type === 'lunchOut')?.time || '';
    const lunchReturn = records.find(r => r.type === 'lunchReturn')?.time || '';
    const exit = records.find(r => r.type === 'exit')?.time || '';
    
    // Calcular total de horas trabalhadas usando o novo serviço
    let total = '';
    const config = getWorkTimeConfig();
    const workTime = TimeCalculationService.calculateWorkTime(records, config);
    
    if (workTime.isComplete) {
      total = TimeCalculationService.formatHours(workTime.workedHours);
    }

    // Converter data corretamente (formato YYYY-MM-DD para DD/MM/YYYY)
    const [year, month, day] = dayRecord.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    return {
      id: dayRecord.date,
      date: formattedDate,
      entry,
      lunchOut,
      lunchReturn,
      exit,
      total
    };
  }, [getWorkTimeConfig]);

  // Carregar todos os registros uma vez
  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os registros
        const allMonthRecords = await registroService.getAllRegistros();
        
        // Converter para o formato da interface
        const processedAllRecords = allMonthRecords.map(processDayRecord);
        setAllReports(processedAllRecords);
        
      } catch (error) {
        console.error('Erro ao carregar todos os relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  // Filtrar registros baseado no mês/ano selecionado
  useEffect(() => {
    const filteredRecords = allReports.filter(record => {
      // Parsear data no formato DD/MM/YYYY
      const parts = record.date.split('/');
      const recordMonth = parseInt(parts[1]);
      const recordYear = parseInt(parts[2]);
      
      return recordMonth === selectedMonth && recordYear === selectedYear;
    });
    
    setReports(filteredRecords);
  }, [allReports, selectedMonth, selectedYear]);

  // Calcular estatísticas quando mudar o período selecionado
  useEffect(() => {
    const calculateStats = async () => {
      try {
        const config = getWorkTimeConfig();
        const monthRecords = await registroService.getRegistrosDoMes(selectedYear, selectedMonth);
        const monthlyStats = TimeCalculationService.calculateMonthlyStats(monthRecords, config);
        
        setStats({
          totalHours: monthlyStats.totalWorkedHours,
          dailyAverage: monthlyStats.averageDailyHours,
          workedDays: monthlyStats.completeDays
        });
      } catch (error) {
        console.error('Erro ao calcular estatísticas:', error);
      }
    };
    
    calculateStats();
  }, [selectedMonth, selectedYear, getWorkTimeConfig]);

  // Função para agrupar registros por mês e dia
  const groupRecords = (records: ProcessedTimeRecord[]): MonthGroup[] => {
    if (!records.length) return [];
    
    const groups = records.reduce((acc: { [key: string]: { [key: string]: ProcessedTimeRecord[] } }, record) => {
      // Corrigido: criar Date usando ano, mês, dia para evitar problemas de fuso
      const [day, month, year] = record.date.split('/');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      const monthKey = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      const dayKey = date.toLocaleString('pt-BR', { day: 'numeric', weekday: 'long' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {};
      }
      if (!acc[monthKey][dayKey]) {
        acc[monthKey][dayKey] = [];
      }
      acc[monthKey][dayKey].push(record);
      return acc;
    }, {});

    return Object.entries(groups).map(([month, days]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      days: Object.entries(days).map(([day, records]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        records
      })).sort((a, b) => {
        // Ordenar dias em ordem decrescente
        const dateA = new Date(records.find(r => r.date.includes(a.day.split(',')[0]))?.date.split('/').reverse().join('-') || '');
        const dateB = new Date(records.find(r => r.date.includes(b.day.split(',')[0]))?.date.split('/').reverse().join('-') || '');
        return dateB.getTime() - dateA.getTime();
      })
    }));
  };

  const monthlyGroups = groupRecords(reports);

  return (
    <div className={styles.containerWrapper}>
      <header className={styles.header}>
        <div>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Relatórios
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
          >
            Acompanhe seus registros de ponto
          </motion.p>
        </div>
      </header>

      <motion.div 
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="monthSelect">Mês:</label>
            <select 
              id="monthSelect"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={styles.filterSelect}
            >
              <option value={1}>Janeiro</option>
              <option value={2}>Fevereiro</option>
              <option value={3}>Março</option>
              <option value={4}>Abril</option>
              <option value={5}>Maio</option>
              <option value={6}>Junho</option>
              <option value={7}>Julho</option>
              <option value={8}>Agosto</option>
              <option value={9}>Setembro</option>
              <option value={10}>Outubro</option>
              <option value={11}>Novembro</option>
              <option value={12}>Dezembro</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="yearSelect">Ano:</label>
            <select 
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={styles.filterSelect}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>&nbsp;</label>
            <button 
              onClick={() => window.location.reload()}
              className={styles.refreshButton}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <StatsCard 
            label="Total de Horas" 
            value={stats.totalHours ? formatHours(stats.totalHours) : '--'} 
            icon={<FiClock size={24} />}
          />
          <StatsCard 
            label="Média Diária" 
            value={stats.dailyAverage ? formatHours(stats.dailyAverage) : '--'} 
            icon={<IoStatsChartOutline size={24} />}
          />
          <StatsCard 
            label="Dias Trabalhados" 
            value={stats.workedDays?.toString() || '--'} 
            icon={<FiCalendar size={24} />}
          />
          <StatsCard 
            label="Registros Carregados" 
            value={allReports.length.toString()} 
            icon={<FiFileText size={24} />}
          />
        </div>

        <div className={styles.listContent}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>Carregando...</p>
            </div>
          ) : monthlyGroups.length > 0 ? (
            monthlyGroups.map((group) => (
              <MonthlyRecordGroup 
                key={group.month} 
                month={group.month} 
                days={group.days} 
              />
            ))
          ) : (
            <div className={styles.emptyContainer}>
              <p className={styles.emptyText}>
                Nenhum registro encontrado para {selectedMonth}/{selectedYear}
                <br />
                <small>Total de registros carregados: {allReports.length}</small>
              </p>
            </div>
          )}
        </div>
      </motion.div>
      <BottomNav />
    </div>
  );
}