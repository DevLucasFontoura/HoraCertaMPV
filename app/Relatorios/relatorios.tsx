import { FiClock, FiCalendar, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { IoStatsChartOutline } from 'react-icons/io5'
import BottomNav from '../components/Menu/menu';
import styles from './relatorios.module.css';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeRecord {
  id: string;
  date: string;
  entry: string;
  lunchOut: string;
  lunchReturn: string;
  exit: string;
  total: string;
}

interface TimeRecordItemProps {
  record: TimeRecord;
}

interface DayGroup {
  day: string;
  records: TimeRecord[];
}

interface MonthGroup {
  month: string;
  days: DayGroup[];
}

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

  const handleEdit = () => {
    if (isEditing) {
      // Aqui você implementaria a lógica para salvar as alterações
      console.log('Salvando alterações:', editedRecord);
    }
    setIsEditing(!isEditing);
  };

  const handleTimeChange = (field: keyof TimeRecord, value: string) => {
    setEditedRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <button onClick={handleEdit} className={styles.editButton}>
          {isEditing ? 'Salvar' : 'Editar'}
        </button>
      </div>
    </motion.div>
  );
};

const DayRecordGroup = ({ day, records }: DayGroup) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalHours = records.reduce((acc, record) => acc + 8, 0);

  return (
    <div className={styles.dayGroup}>
      <button 
        className={styles.dayHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.dayInfo}>
          <h4 className={styles.dayTitle}>{day}</h4>
          <span className={styles.dayStats}>
            {records.length} registros • {totalHours}h
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
    acc + day.records.reduce((sum, record) => sum + 8, 0), 0
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
            {totalRecords} registros • {totalHours}h totais
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
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TimeRecord[]>([]);
  const [stats, setStats] = useState({
    totalHours: null,
    dailyAverage: null,
    workedDays: null
  });

  useEffect(() => {
    // Função para buscar dados dos relatórios (a ser implementada)
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Aqui virá a chamada real à API
        // const response = await api.getReports();
        // setReports(response.records);
        // setStats(response.stats);
        setReports([]); // Temporário até implementar a API
        setStats({
          totalHours: null,
          dailyAverage: null,
          workedDays: null
        });
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Função para agrupar registros por mês e dia
  const groupRecords = (records: TimeRecord[]): MonthGroup[] => {
    if (!records.length) return [];
    
    const groups = records.reduce((acc: { [key: string]: { [key: string]: TimeRecord[] } }, record) => {
      const date = new Date(record.date.split('/').reverse().join('-'));
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
        <div className={styles.statsContainer}>
          <StatsCard 
            label="Total de Horas" 
            value={stats.totalHours ? `${stats.totalHours}h` : '--'} 
            icon={<FiClock size={24} />}
          />
          <StatsCard 
            label="Média Diária" 
            value={stats.dailyAverage ? `${stats.dailyAverage}h` : '--'} 
            icon={<IoStatsChartOutline size={24} />}
          />
          <StatsCard 
            label="Dias Trabalhados" 
            value={stats.workedDays?.toString() || '--'} 
            icon={<FiCalendar size={24} />}
          />
          <StatsCard 
            label="Relatório Completo" 
            value="Em breve" 
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
              <p className={styles.emptyText}>Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
      <BottomNav />
    </div>
  );
}