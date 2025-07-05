import { AiOutlineCoffee, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import PageTransition from '../components/PageTransition/pageTransition';
import pageStyles from '../../styles/PageStyles.module.css';
import { CONSTANTES } from '../common/constantes';
import BottomNav from '../components/Menu/menu';
import styles from './registrarPonto.module.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@mui/material';
import TimeConfirmationModal from '../components/PopUpConfirmacao/popUpConfirmacao';

interface TimeState {
  hours: string;
  minutes: string;
  seconds: string;
}

interface TimeRecord {
  type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit';
  time: string;
  label: string;
}

const timeDisplayVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  }
};

export default function RegistrarPonto() {
  const [currentTime, setCurrentTime] = useState<TimeState>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todayRecords, setTodayRecords] = useState<TimeRecord[]>([]);

  // Estado para controlar quais botões estão habilitados
  const [todayRecord, setTodayRecord] = useState({
    entry: false,
    lunchOut: false,
    lunchReturn: false,
    exit: false
  });

  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegisterType, setSelectedRegisterType] = useState<'entry' | 'lunchOut' | 'lunchReturn' | 'exit' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegister = (type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit') => {
    setSelectedRegisterType(type);
    setIsModalOpen(true);
  };

  const handleConfirmRegister = (adjustedTime: Date) => {
    if (!selectedRegisterType) return;
    
    setLoading(true);
    setError('');
    
    const timeString = adjustedTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const typeLabels = {
      entry: CONSTANTES.RP_ENTRADA,
      lunchOut: CONSTANTES.RP_SAIDA_ALMOCO,
      lunchReturn: CONSTANTES.RP_RETORNO_ALMOCO,
      exit: CONSTANTES.RP_SAIDA
    };

    setTimeout(() => {
      setTodayRecord(prev => ({
        ...prev,
        [selectedRegisterType]: true
      }));

      setTodayRecords(prev => [...prev, {
        type: selectedRegisterType,
        time: timeString,
        label: typeLabels[selectedRegisterType]
      }]);

      setSuccess('Ponto registrado com sucesso!');
      setLoading(false);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{CONSTANTES.TITULO_REGISTRO_DE_PONTO}</h1>
          <p className={styles.pageSubtitle}>{CONSTANTES.SUBTITULO_REGISTRO_DE_PONTO}</p>
        </div>

        <div className={pageStyles.card}>
          <motion.div 
            className={styles.timeDisplay}
            initial="hidden"
            animate="visible"
            variants={timeDisplayVariants}
          >
            <div className={styles.timeValue}>
              {currentTime.hours}:{currentTime.minutes}:{currentTime.seconds}
            </div>
            <div className={styles.timeDate}>
              {new Date().toLocaleDateString(CONSTANTES.IDIOMA_PT_BR, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>

          <div className={styles.modeSwitch}>
            <span>Modo simplificado</span>
            <Switch
              checked={simplifiedMode}
              onChange={(e) => setSimplifiedMode(e.target.checked)}
              color="primary"
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <div className={`${styles.buttonGrid} ${simplifiedMode ? styles.simplifiedGrid : ''}`}>
            <button 
              className={styles.timeButton}
              onClick={() => handleRegister('entry')} 
              disabled={loading || todayRecord.entry}
            >
              <div className={styles.buttonIcon}><AiOutlineLogin /></div>
              <div className={styles.buttonLabel}>{CONSTANTES.RP_ENTRADA}</div>
            </button>

            {!simplifiedMode ? (
              <>
                <button 
                  className={styles.timeButton}
                  onClick={() => handleRegister('lunchOut')} 
                  disabled={loading || !todayRecord.entry || todayRecord.lunchOut}
                >
                  <div className={styles.buttonIcon}><AiOutlineCoffee /></div>
                  <div className={styles.buttonLabel}>{CONSTANTES.RP_SAIDA_ALMOCO}</div>
                </button>

                <button 
                  className={styles.timeButton}
                  onClick={() => handleRegister('lunchReturn')} 
                  disabled={loading || !todayRecord.lunchOut || todayRecord.lunchReturn}
                >
                  <div className={styles.buttonIcon}><AiOutlineLogin /></div>
                  <div className={styles.buttonLabel}>{CONSTANTES.RP_RETORNO_ALMOCO}</div>
                </button>
              </>
            ) : (
              <div></div>
            )}

            <button 
              className={styles.timeButton}
              onClick={() => handleRegister('exit')} 
              disabled={loading || (!simplifiedMode ? !todayRecord.lunchReturn : !todayRecord.entry) || todayRecord.exit}
            >
              <div className={styles.buttonIcon}><AiOutlineLogout /></div>
              <div className={styles.buttonLabel}>{CONSTANTES.RP_SAIDA}</div>
            </button>
          </div>

          <motion.div
            className={styles.historySection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.historyTitle}>{CONSTANTES.RP_HISTORICO_DE_HOJE}</h2>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineWrapper}>
                {todayRecords.map((record, index) => (
                  <motion.div 
                    key={index}
                    className={styles.timelineItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineTime}>{record.time}</span>
                      <span className={styles.timelineLabel}>{record.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNav />
      
      <TimeConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRegister}
        currentTime={new Date()}
      />
    </PageTransition>
  );
}